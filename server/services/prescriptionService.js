import Prescription from '../models/Prescription.js';
import { logger } from '../utils/logger.js';

export const createPrescription = async (prescriptionData) => {
  try {
    const prescription = await Prescription.create(prescriptionData);
    await prescription.populate(['patient', 'doctor']);
    logger.info(`Prescription created for patient: ${prescription.patient}`);
    return prescription;
  } catch (error) {
    logger.error(`Error creating prescription: ${error.message}`);
    throw error;
  }
};

export const getPrescriptions = async (query, options = {}) => {
  try {
    const { page = 1, limit = 10, sort = '-createdAt' } = options;
    const prescriptions = await Prescription.find(query)
      .populate(['patient', 'doctor'])
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Prescription.countDocuments(query);

    return {
      prescriptions,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    logger.error(`Error fetching prescriptions: ${error.message}`);
    throw error;
  }
};

export const getPrescriptionById = async (id) => {
  try {
    const prescription = await Prescription.findById(id)
      .populate(['patient', 'doctor']);
    
    if (!prescription) {
      throw new Error('Prescription not found');
    }
    
    return prescription;
  } catch (error) {
    logger.error(`Error fetching prescription: ${error.message}`);
    throw error;
  }
};

export const updatePrescription = async (id, updateData) => {
  try {
    const prescription = await Prescription.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate(['patient', 'doctor']);

    if (!prescription) {
      throw new Error('Prescription not found');
    }

    logger.info(`Prescription updated: ${id}`);
    return prescription;
  } catch (error) {
    logger.error(`Error updating prescription: ${error.message}`);
    throw error;
  }
};

export const deletePrescription = async (id) => {
  try {
    const prescription = await Prescription.findByIdAndDelete(id);
    
    if (!prescription) {
      throw new Error('Prescription not found');
    }

    logger.info(`Prescription deleted: ${id}`);
    return prescription;
  } catch (error) {
    logger.error(`Error deleting prescription: ${error.message}`);
    throw error;
  }
};