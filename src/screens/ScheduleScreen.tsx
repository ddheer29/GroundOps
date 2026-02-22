import groupBy from 'lodash/groupBy';
import filter from 'lodash/filter';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  Alert,
  View,
  Modal,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {
  ExpandableCalendar,
  TimelineEventProps,
  TimelineList,
  CalendarProvider,
  TimelineProps,
} from 'react-native-calendars';

import { useQuery } from '../database/realm';
import { User } from '../database/schemas';
import { ApiClient } from '../api/client';

import { getDate } from '../mocks/timelineEvents';
import { COLORS } from '../theme/theme';
import { CalendarUtils } from '../utils/CalendarUtils';

const INITIAL_TIME = { hour: 9, minutes: 0 };

export const ScheduleScreen = () => {
  const users = useQuery(User);
  const user = users[0];

  const [currentDate, setCurrentDate] = useState(getDate());
  const [eventsByDate, setEventsByDate] = useState<{
    [key: string]: TimelineEventProps[];
  }>({});

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDescription, setNewEventDescription] = useState('');
  const [selectedTimeObj, setSelectedTimeObj] = useState<any>(null);
  const [selectedTimeStr, setSelectedTimeStr] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<TimelineEventProps | null>(
    null,
  );
  const [isEditing, setIsEditing] = useState(false);
  const [loader, setLoader] = useState(false);

  const formatTimeForCalendar = (isoString: string) => {
    const d = new Date(isoString);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
      d.getDate(),
    )} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };

  const fetchEvents = async () => {
    if (!user?.token) return;
    try {
      setLoader(true);
      const scheduleEvents = await ApiClient.fetchEvents(user.token);

      const mappedEvents: TimelineEventProps[] = scheduleEvents.map(evt => ({
        id: evt._id,
        start: formatTimeForCalendar(evt.start),
        end: formatTimeForCalendar(evt.end),
        title: evt.title,
        summary: evt.description,
        color: evt.color || 'lightblue',
      }));

      const grouped = groupBy(mappedEvents, e => e.start.split(' ')[0]);
      setEventsByDate(grouped);
      setLoader(false);
    } catch (error) {
      console.error('Failed to fetch schedule events', error);
      Alert.alert('Error', 'Failed to load events.');
      setLoader(false);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchEvents();
    }
  }, [user?.token]);

  // This marks dots under dates in calendar.
  const marked = useMemo(() => {
    const marks: any = {};
    Object.keys(eventsByDate).forEach(date => {
      marks[date] = { marked: true };
    });
    return marks;
  }, [eventsByDate]);

  // When user selects another date → update state.
  const onDateChanged = useCallback((date: string, source: string) => {
    console.log('ScheduleScreen onDateChanged: ', date, source);
    setCurrentDate(date);
  }, []);

  const onMonthChange = useCallback((month: any, updateSource: any) => {
    console.log('ScheduleScreen onMonthChange: ', month, updateSource);
  }, []);

  // Takes pressed time, Creates 1-hour event, Adds temporary event with id = "draft"
  const createNewEvent: TimelineProps['onBackgroundLongPress'] = useCallback(
    (timeString: string, timeObject: any) => {
      const hourString = `${(timeObject.hour + 1).toString().padStart(2, '0')}`;
      const minutesString = `${timeObject.minutes.toString().padStart(2, '0')}`;

      const newEvent = {
        id: 'draft',
        start: `${timeString}`,
        end: `${timeObject.date} ${hourString}:${minutesString}:00`,
        title: 'New Event',
        color: 'white',
      };
      if (timeObject.date) {
        setEventsByDate(prevEventsByDate => {
          const updatedEventsByDate = { ...prevEventsByDate };

          // if we already have events on that date, add to them, otherwise create new array
          if (updatedEventsByDate[timeObject.date]) {
            updatedEventsByDate[timeObject.date] = [
              ...updatedEventsByDate[timeObject.date],
              newEvent,
            ];
          } else {
            updatedEventsByDate[timeObject.date] = [newEvent];
          }

          return updatedEventsByDate;
        });
      }
    },
    [],
  );

  const approveNewEvent: TimelineProps['onBackgroundLongPressOut'] =
    useCallback((timeString: string, timeObject: any) => {
      setSelectedTimeStr(timeString);
      setSelectedTimeObj(timeObject);
      setIsModalVisible(true);
    }, []);

  const handleModalClose = () => {
    setIsModalVisible(false);
    setNewEventTitle('');
    setNewEventDescription('');
    setIsEditing(false);
    setSelectedEvent(null);

    if (!isEditing && selectedTimeObj?.date) {
      setEventsByDate(prevEventsByDate => {
        const updatedEventsByDate = { ...prevEventsByDate };
        updatedEventsByDate[selectedTimeObj.date] = filter(
          updatedEventsByDate[selectedTimeObj.date],
          e => e.id !== 'draft',
        );
        return updatedEventsByDate;
      });
    }

    setSelectedTimeObj(null);
    setSelectedTimeStr('');
  };

  const handleCreateEvent = async () => {
    if (!user?.token) return;
    if (!isEditing && !selectedTimeObj) return;

    try {
      if (
        isEditing &&
        selectedEvent &&
        selectedEvent.id &&
        selectedEvent.start
      ) {
        const updatedEvt = await ApiClient.updateEvent(selectedEvent.id, {
          title: newEventTitle || 'New Event',
          description: newEventDescription,
        });

        setIsModalVisible(false);
        setNewEventTitle('');
        setNewEventDescription('');
        setIsEditing(false);
        setSelectedEvent(null);

        const eventDate = selectedEvent.start.split(' ')[0];

        setEventsByDate(prevEventsByDate => {
          const updatedEventsByDate = { ...prevEventsByDate };
          const filtered = filter(
            updatedEventsByDate[eventDate] || [],
            e => e.id !== selectedEvent.id,
          );

          const calendarEvt: TimelineEventProps = {
            id: updatedEvt._id,
            start: formatTimeForCalendar(updatedEvt.start),
            end: formatTimeForCalendar(updatedEvt.end),
            title: updatedEvt.title,
            summary: updatedEvt.description,
            color: updatedEvt.color || CalendarUtils.getRandomPastelColor(),
          };

          updatedEventsByDate[eventDate] = [...filtered, calendarEvt];
          return updatedEventsByDate;
        });
      } else {
        const hourString = `${(selectedTimeObj.hour + 1)
          .toString()
          .padStart(2, '0')}`;
        const minutesString = `${selectedTimeObj.minutes
          .toString()
          .padStart(2, '0')}`;

        const startLocal = selectedTimeStr;
        const endLocal = `${selectedTimeObj.date} ${hourString}:${minutesString}:00`;

        const startIso = new Date(startLocal).toISOString();
        const endIso = new Date(endLocal).toISOString();

        const newEvt = await ApiClient.createEvent({
          title: newEventTitle || 'New Event',
          description: newEventDescription,
          start: startIso,
          end: endIso,
          color: CalendarUtils.getRandomPastelColor(),
        });

        setIsModalVisible(false);
        setNewEventTitle('');
        setNewEventDescription('');
        setIsEditing(false);
        setSelectedEvent(null);

        setEventsByDate(prevEventsByDate => {
          const updatedEventsByDate = { ...prevEventsByDate };

          const filtered = filter(
            updatedEventsByDate[selectedTimeObj.date] || [],
            e => e.id !== 'draft',
          );

          const calendarEvt: TimelineEventProps = {
            id: newEvt._id,
            start: formatTimeForCalendar(newEvt.start),
            end: formatTimeForCalendar(newEvt.end),
            title: newEvt.title,
            summary: newEvt.description,
            color: newEvt.color || 'lightblue',
          };

          updatedEventsByDate[selectedTimeObj.date] = [
            ...filtered,
            calendarEvt,
          ];
          return updatedEventsByDate;
        });

        setSelectedTimeObj(null);
        setSelectedTimeStr('');
      }
    } catch (error) {
      console.error('Failed to save event', error);
      Alert.alert('Error', 'Failed to save personal event');
    }
  };

  const handleDeleteEvent = async (event: TimelineEventProps) => {
    if (!user?.token || !event.id) return;
    try {
      await ApiClient.deleteEvent(event.id);
      const eventDate = event.start.split(' ')[0];
      setEventsByDate(prevEventsByDate => {
        const updatedEventsByDate = { ...prevEventsByDate };
        if (updatedEventsByDate[eventDate]) {
          updatedEventsByDate[eventDate] = filter(
            updatedEventsByDate[eventDate],
            e => e.id !== event.id,
          );
        }
        return updatedEventsByDate;
      });
    } catch (error) {
      console.error('Failed to delete event', error);
      Alert.alert('Error', 'Failed to delete event');
    }
  };

  const handleEventPress = (event: TimelineEventProps) => {
    Alert.alert('Event Options', event.title || 'Event', [
      {
        text: 'Edit',
        style: 'default',
        onPress: () => {
          setIsEditing(true);
          setSelectedEvent(event);
          setNewEventTitle(event.title || '');
          setNewEventDescription(event.summary || '');
          setIsModalVisible(true);
        },
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => handleDeleteEvent(event),
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };

  const timelineProps: Partial<TimelineProps> = useMemo(
    () => ({
      format24h: true,
      onBackgroundLongPress: createNewEvent,
      onBackgroundLongPressOut: approveNewEvent,
      onEventPress: handleEventPress,
      // unavailableHours: [
      //   { start: 0, end: 6 },
      //   { start: 22, end: 24 },
      // ],
      overlapEventsSpacing: 8,
      rightEdgeSpacing: 24,
    }),
    [createNewEvent, approveNewEvent],
  );

  if (loader) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <CalendarProvider
      date={currentDate}
      onDateChanged={onDateChanged}
      onMonthChange={onMonthChange}
      showTodayButton
      disabledOpacity={0.6}
    >
      <ExpandableCalendar firstDay={1} markedDates={marked} />
      <TimelineList
        events={eventsByDate}
        timelineProps={{ ...timelineProps, key: 'timeline' } as any}
        showNowIndicator
        scrollToFirst
        initialTime={INITIAL_TIME}
      />
      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {isEditing ? 'Edit Personal Event' : 'New Personal Event'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={newEventTitle}
              onChangeText={setNewEventTitle}
              placeholderTextColor="#999"
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description (Optional)"
              value={newEventDescription}
              onChangeText={setNewEventDescription}
              multiline
              numberOfLines={4}
              placeholderTextColor="#999"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={handleModalClose}
                style={styles.buttonCancel}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCreateEvent}
                style={styles.buttonSave}
              >
                <Text style={styles.buttonTextWhite}>
                  {isEditing ? 'Update' : 'Create'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </CalendarProvider>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    width: '85%',
    padding: 20,
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  buttonCancel: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  buttonSave: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: '#007AFF',
  },
  buttonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  buttonTextWhite: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
});
