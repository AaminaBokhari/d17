import MedicalHistory from '../models/MedicalHistory.js';
import { logger } from '../utils/logger.js';

export const createMedicalHistory = async (historyData) => {
  try {
    const medicalHistory = await MedicalHistory.create(historyData);
    await medicalHistory.populate(['patient', 'doctor', 'prescription']);
    logger.info(`Medical history created for patient: ${medicalHistory.patient}`);
    return medicalHistory;
  } catch (error) {
    logger.error(`Error creating medical history: ${error.message}`);
    throw error;
  }
};

export const getMedicalHistory = async (query, options = {}) => {
  try {
    const { page = 1, limit = 10, sort = '-date' } = options;
    const medicalHistory = await MedicalHistory.find(query)
      .populate(['patient', 'doctor', 'prescription'])
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await MedicalHistory.countDocuments(query);

    return {
      records: medicalHistory,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    logger.error(`Error fetching medical history: ${error.message}`);
    throw error;
  }
};

export const getPatientMedicalHistory = async (patientId, options = {}) => {
  try {
    const { page = 1, limit = 10, sort = '-date' } = options;
    const medicalHistory = await MedicalHistory.find({ patient: patientId })
      .populate(['doctor', 'prescription'])
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await MedicalHistory.countDocuments({ patient: patientId });

    return {
      records: medicalHistory,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    logger.error(`Error fetching patient medical history: ${error.message}`);
    throw error;
  }
};

export const updateMedicalHistory = async (id, updateData) => {
  try {
    const medicalHistory = await MedicalHistory.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate(['patient', 'doctor', 'prescription']);

    if (!medicalHistory) {
      throw new Error('Medical history record not found');
    }

    logger.info(`Medical history updated: ${id}`);
    return medicalHistory;
  } catch (error) {
    logger.error(`Error updating medical history: ${error.message}`);
    throw error;
  }
};