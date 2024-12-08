import React from 'react';
import { useMedicalHistory } from '../hooks/useMedicalHistory';
import PatientHistoryList from '../components/MedicalHistory/PatientHistoryList';
import PatientSearch from '../components/MedicalHistory/PatientSearch';
import RecordForm from '../components/MedicalHistory/RecordForm';
import LoadingSpinner from '../components/common/LoadingSpinner';

function MedicalHistory() {
  const { medicalHistory, isLoading, error, createRecord } = useMedicalHistory();

  const handleSearch = (query) => {
    // TODO: Implement search functionality
    console.log('Searching for:', query);
  };

  const handleCreateRecord = async (data) => {
    try {
      await createRecord(data);
    } catch (error) {
      console.error('Error creating record:', error);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Medical History</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PatientSearch onSearch={handleSearch} />
          <PatientHistoryList 
            history={medicalHistory} 
            isLoading={isLoading} 
            error={error} 
          />
        </div>
        <div>
          <RecordForm onSubmit={handleCreateRecord} />
        </div>
      </div>
    </div>
  );
}

export default MedicalHistory;