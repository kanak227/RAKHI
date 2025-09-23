import React, { createContext, useContext, useEffect, useReducer } from 'react';
import ApiService from '../services/apiService';
import { useAuth } from './AuthContext';

const VoiceContext = createContext();

// Voice reducer
const voiceReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_CODEWORD':
      return {
        ...state,
        codeword: action.payload,
        loading: false,
        error: null,
      };
    case 'SET_STATUS':
      return {
        ...state,
        status: action.payload,
        loading: false,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'SET_LISTENING':
      return { ...state, isListening: action.payload };
    case 'SET_RECORDING':
      return { ...state, isRecording: action.payload };
    case 'SET_EMERGENCY':
      return { ...state, isEmergency: action.payload };
    default:
      return state;
  }
};

const initialState = {
  codeword: null,
  status: null,
  isListening: false,
  isRecording: false,
  isEmergency: false,
  loading: false,
  error: null,
};

export const VoiceProvider = ({ children }) => {
  const [state, dispatch] = useReducer(voiceReducer, initialState);
  const { isAuthenticated, user } = useAuth();

  // Load voice codeword when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadVoiceCodeword();
      loadVoiceStatus();
    }
  }, [isAuthenticated, user]);

  const loadVoiceCodeword = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await ApiService.getVoiceCodeword();
      
      dispatch({
        type: 'SET_CODEWORD',
        payload: response.codeword,
      });
    } catch (error) {
      console.error('Error loading voice codeword:', error);
      dispatch({
        type: 'SET_ERROR',
        payload: error.message,
      });
    }
  };

  const loadVoiceStatus = async () => {
    try {
      const response = await ApiService.getVictimStatus();
      
      dispatch({
        type: 'SET_STATUS',
        payload: response.victim,
      });
      
      dispatch({
        type: 'SET_LISTENING',
        payload: response.victim.voiceCodeword.isListening,
      });
      
      dispatch({
        type: 'SET_EMERGENCY',
        payload: response.victim.status === 'emergency',
      });
    } catch (error) {
      console.error('Error loading voice status:', error);
    }
  };

  const setVoiceCodeword = async (codewordData, audioFile = null) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await ApiService.setVoiceCodeword(codewordData, audioFile);
      
      dispatch({
        type: 'SET_CODEWORD',
        payload: response.codeword,
      });
      
      // Start listening after setting codeword
      await startListening();
      
      return response;
    } catch (error) {
      console.error('Error setting voice codeword:', error);
      dispatch({
        type: 'SET_ERROR',
        payload: error.message,
      });
      throw error;
    }
  };

  const toggleVoiceCodeword = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await ApiService.toggleVoiceCodeword();
      
      dispatch({
        type: 'SET_LISTENING',
        payload: response.isActive,
      });
      
      // Update codeword status
      if (state.codeword) {
        dispatch({
          type: 'SET_CODEWORD',
          payload: {
            ...state.codeword,
            isActive: response.isActive,
          },
        });
      }
      
      return response;
    } catch (error) {
      console.error('Error toggling voice codeword:', error);
      dispatch({
        type: 'SET_ERROR',
        payload: error.message,
      });
      throw error;
    }
  };

  const deleteVoiceCodeword = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      await ApiService.deleteVoiceCodeword();
      
      dispatch({
        type: 'SET_CODEWORD',
        payload: null,
      });
      
      dispatch({
        type: 'SET_LISTENING',
        payload: false,
      });
    } catch (error) {
      console.error('Error deleting voice codeword:', error);
      dispatch({
        type: 'SET_ERROR',
        payload: error.message,
      });
      throw error;
    }
  };

  const startListening = async () => {
    try {
      if (!state.codeword?.text) {
        throw new Error('No codeword set');
      }
      
      await ApiService.startVoiceListening(state.codeword.text);
      
      dispatch({
        type: 'SET_LISTENING',
        payload: true,
      });
    } catch (error) {
      console.error('Error starting voice listening:', error);
      dispatch({
        type: 'SET_ERROR',
        payload: error.message,
      });
      throw error;
    }
  };

  const stopListening = async () => {
    try {
      await ApiService.stopVoiceListening();
      
      dispatch({
        type: 'SET_LISTENING',
        payload: false,
      });
    } catch (error) {
      console.error('Error stopping voice listening:', error);
      dispatch({
        type: 'SET_ERROR',
        payload: error.message,
      });
      throw error;
    }
  };

  const testVoiceRecognition = async (codeword, audioFile) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await ApiService.testVoiceRecognition(codeword, audioFile);
      
      dispatch({ type: 'SET_LOADING', payload: false });
      
      return response;
    } catch (error) {
      console.error('Error testing voice recognition:', error);
      dispatch({
        type: 'SET_ERROR',
        payload: error.message,
      });
      throw error;
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    setVoiceCodeword,
    toggleVoiceCodeword,
    deleteVoiceCodeword,
    startListening,
    stopListening,
    testVoiceRecognition,
    loadVoiceCodeword,
    loadVoiceStatus,
    clearError,
  };

  return <VoiceContext.Provider value={value}>{children}</VoiceContext.Provider>;
};

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error('useVoice must be used within a VoiceProvider');
  }
  return context;
};

