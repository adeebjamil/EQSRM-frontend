import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getEmployee } from '../services/api';
import EmployeeCard from '../components/Employee/EmployeeCard';

export default function QrRedirect() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setLoading(true);
        const response = await getEmployee(id);
        setEmployee(response.data);
      } catch (err) {
        setError('Employee not found or error loading data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEmployee();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="text-center py-12 px-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md mx-auto">
          <p className="font-bold">Error</p>
          <p>{error || 'Employee not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 px-3 sm:py-8 sm:px-4">
      <div className="max-w-xl mx-auto">
        <div className="mb-4 sm:mb-6 text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Employee Digital ID</h1>
          <p className="text-gray-600 text-sm sm:text-base">Scan result for employee #{id}</p>
        </div>
        
        <EmployeeCard employee={employee} isDigitalCard={true} />
      </div>
    </div>
  );
}