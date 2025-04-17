import { QRCodeSVG } from 'qrcode.react';

export default function EmployeeCard({ employee, isDigitalCard = false }) {
  // Format date to readable format
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${isDigitalCard ? 'max-w-lg mx-auto' : ''}`}>
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 p-4 flex items-center justify-center bg-gray-100">
          {employee.profileImage ? (
            <img 
              src={employee.profileImage} 
              alt={`${employee.name}'s profile`}
              className="w-40 h-40 object-cover rounded-full border-4 border-blue-500"
            />
          ) : (
            <div className="w-40 h-40 rounded-full bg-gray-300 flex items-center justify-center border-4 border-blue-500">
              <span className="text-2xl text-gray-600">{employee.name?.charAt(0)}</span>
            </div>
          )}
        </div>
        
        <div className="md:w-2/3 p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{employee.name}</h2>
              <p className="text-gray-600 font-medium">{employee.position}</p>
              <p className="text-sm text-gray-500 mt-1">ID: {employee.employeeId}</p>
            </div>
            
            {/* QR Code */}
            <div>
              {employee.qrCode ? (
                <img 
                  src={employee.qrCode} 
                  alt="QR Code" 
                  className="w-24 h-24"
                />
              ) : (
                <QRCodeSVG 
                  value={`${window.location.origin}/employee/${employee.employeeId}`} 
                  size={96}
                  level="H"
                  includeMargin={true}
                />
              )}
            </div>
          </div>
          
          <div className="mt-6 space-y-2">
            <p className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {employee.email}
            </p>
            <p className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {employee.phone}
            </p>
            {employee.address && (
              <p className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm">{employee.address}</span>
              </p>
            )}
            <p className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Joined: {formatDate(employee.joiningDate)}
            </p>
          </div>
        </div>
      </div>
      
      {isDigitalCard && (
        <div className="bg-blue-600 py-3 px-6 text-white">
          <div className="flex items-center justify-between">
            <p>Official Employee ID Card</p>
            <div className="flex items-center">
              <img 
                src="/Frame 3.png" 
                alt="Company Logo" 
                className="h-6 w-auto mr-2" 
              />
              <span className="text-sm">Lovosis Technology Pvt. Ltd.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}