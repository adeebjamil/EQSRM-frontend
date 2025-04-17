import { useState, useEffect } from 'react';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from '../services/api';
import EmployeeForm from '../components/Employee/EmployeeForm';
import EmployeeCard from '../components/Employee/EmployeeCard';
import { toast } from 'react-toastify';

export default function AdminDashboard() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Load employees on mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await getEmployees();
      setEmployees(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load employees: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = () => {
    setCurrentEmployee(null);
    setIsEditing(false);
    setShowForm(true);
  };

  const handleEditEmployee = (employee) => {
    setCurrentEmployee(employee);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDeleteEmployee = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await deleteEmployee(id);
        setEmployees(employees.filter(emp => emp.employeeId !== id));
        toast.success('Employee deleted successfully');
      } catch (err) {
        toast.error('Failed to delete employee: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (isEditing) {
        const response = await updateEmployee(currentEmployee.employeeId, formData);
        setEmployees(employees.map(emp => 
          emp.employeeId === currentEmployee.employeeId ? response.data : emp
         ));
        toast.success('Employee updated successfully');
      } else {
        const response = await createEmployee(formData);
        setEmployees([...employees, response.data]);
        toast.success('Employee added successfully');
      }
      setShowForm(false);
      setCurrentEmployee(null);
    } catch (err) {
      throw err; // Pass to form component for error handling
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setCurrentEmployee(null);
  };

  // Handle download QR code
  const handleDownloadQR = (employee) => {
    try {
      const link = document.createElement('a');
      link.href = employee.qrCode;
      link.download = `${employee.name}_QR.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('QR code downloaded successfully');
    } catch (error) {
      toast.error('Failed to download QR code');
    }
  };

  // Print employee card
  const handlePrintCard = (employee) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Employee Card - ${employee.name} - Lovosis Technology</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <style>
            body { padding: 20px; }
            @media print {
              body { padding: 0; }
              button { display: none !important; }
            }
          </style>
        </head>
        <body>
          <div class="max-w-2xl mx-auto">
            <div class="mb-4 flex justify-between items-center">
              <div class="flex items-center">
                <img src="${window.location.origin}/Frame 3.png" alt="Lovosis Technology Logo" class="h-12 w-auto mr-2">
                <div>
                  <span class="font-bold text-blue-700">Lovosis Technology</span>
                  <span class="text-xs block">Private Limited</span>
                </div>
              </div>
              <button onclick="window.print()" class="px-4 py-2 bg-blue-600 text-white rounded">
                Print Card
              </button>
            </div>
            
            <div class="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-300">
              <div class="flex flex-col md:flex-row">
                <div class="md:w-1/3 p-6 flex items-center justify-center bg-gray-100">
                  ${employee.profileImage 
                    ? `<img src="${employee.profileImage}" alt="Profile" class="w-40 h-40 object-cover rounded-full border-4 border-blue-500">`
                    : `<div class="w-40 h-40 rounded-full bg-gray-300 flex items-center justify-center border-4 border-blue-500">
                        <span class="text-2xl text-gray-600">${employee.name.charAt(0)}</span>
                      </div>`
                  }
                </div>
                
                <div class="md:w-2/3 p-6">
                  <div class="flex justify-between items-start">
                    <div>
                      <h2 class="text-2xl font-bold text-gray-800">${employee.name}</h2>
                      <p class="text-gray-600 font-medium">${employee.position}</p>
                      <p class="text-sm text-gray-500 mt-1">ID: ${employee.employeeId}</p>
                    </div>
                    
                    <div>
                      <img src="${employee.qrCode}" alt="QR Code" class="w-24 h-24">
                    </div>
                  </div>
                  
                  <div class="mt-6 space-y-2">
                    <p>${employee.email}</p>
                    <p>${employee.phone}</p>
                    ${employee.address ? `<p class="text-sm">${employee.address}</p>` : ''}
                    <p>Joined: ${new Date(employee.joiningDate).toLocaleDateString() || 'N/A'}</p>
                  </div>
                </div>
              </div>
              
              <div class="bg-blue-600 py-3 px-6 text-white flex justify-between items-center">
                <p>Official Employee ID Card</p>
                <span class="text-sm">Lovosis Technology Pvt. Ltd.</span>
              </div>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="px-2 sm:px-0">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-0">Admin Dashboard</h1>
        
        {!showForm && (
          <button
            onClick={handleAddEmployee}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center justify-center sm:justify-start"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Employee
          </button>
        )}
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {showForm ? (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {isEditing ? 'Edit Employee' : 'Add New Employee'}
            </h2>
            <button 
              onClick={handleCancel}
              className="text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
          
          <EmployeeForm 
            onSubmit={handleSubmit} 
            initialData={currentEmployee} 
            isEditing={isEditing} 
          />
        </div>
      ) : (
        <div>
          {/* Employee list with scroller */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">All Employees</h2>
            
            {/* Scrollable container */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : employees.length === 0 ? (
                  <div className="text-center py-10 bg-white rounded-lg border border-gray-200">
                    <p className="text-gray-500 mb-4">No employees found</p>
                    <button
                      onClick={handleAddEmployee}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded inline-flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Add Employee
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {employees.map(employee => (
                      <div key={employee.employeeId} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                        <EmployeeCard employee={employee} />
                        
                        <div className="p-4 bg-gray-50 border-t border-gray-200 flex flex-wrap justify-between gap-2">
                          <div>
                            <button
                              onClick={() => handleEditEmployee(employee)}
                              className="mr-2 bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteEmployee(employee.employeeId)}
                              className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded text-sm"
                            >
                              Delete
                            </button>
                          </div>
                          <div>
                            <button
                              onClick={() => handleDownloadQR(employee)}
                              className="mr-2 bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded text-sm"
                            >
                              Download QR
                            </button>
                            <button
                              onClick={() => handlePrintCard(employee)}
                              className="bg-purple-600 hover:bg-purple-700 text-white py-1 px-3 rounded text-sm"
                            >
                              Print Card
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}