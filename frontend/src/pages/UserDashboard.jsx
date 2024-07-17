import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";


const Spinner = () => (
  <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291l1.293-1.293a1 1 0 010-1.414L6 13.291V17zm8-1.383a1 1 0 00-1.414 0L12 15.586 10.707 14.293a1 1 0 00-1.414 0L6 17.586V20h8v-3.383z"></path>
  </svg>
);

const UserDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    role: '',
    salaryMin: '',
    workExperienceMinYears: '',
    isRemote: false,
    employmentType: '',
    status: '',
  });
  const navigate = useNavigate();

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams(filters);
      if (searchTerm) {
        queryParams.append('search', searchTerm);
      }

      const response = await fetch(`http://localhost:3000/api/v1/job/search-jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ search: searchTerm, filters }),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }

      const responseData = await response.json();
      setJobs(responseData.data);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to fetch jobs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [searchTerm, filters]);

  const handleJobClick = (jobId) => {
    navigate(`/job/${jobId}`);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleReset = () => {
    fetchJobs();
    setFilters({
      role: '',
      salaryMin: '',
      workExperienceMinYears: '',
      isRemote: false,
      employmentType: '',
      status: '',
    });
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    const parsedValue = type === 'checkbox' ? checked : (name === 'salaryMin' || name === 'workExperienceMinYears') ? Math.max(0, parseInt(value, 10)) : 0 ? (typeof value == NaN) : value;
    setFilters({ ...filters, [name]: parsedValue });
  };
  
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">Job Search</h1>
      <div className="flex flex-col md:flex-row mb-4 space-y-4 md:space-y-0 md:space-x-4">
        <input
          className="w-full p-3 border border-gray-300 rounded"
          type="text"
          placeholder="Search for jobs..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <Select onValueChange={(value) => setFilters({ ...filters, employmentType: value })} className="w-1/3">
            <SelectTrigger className="w-1/3">
                <SelectValue placeholder="Select employment type" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="Full-time">Full-Time</SelectItem>
                <SelectItem value="Part-time">Part-Time</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
                <SelectItem value="Internship">Internship</SelectItem>
            </SelectContent>
        </Select>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filters.isRemote}
            onChange={handleFilterChange}
            name="isRemote"
            className="mr-2"
          />
          Remote
        </label>
        <input
            type="number"
            name="salaryMin"
            className="w-2/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
            value={ 0 ? !filters.salaryMin : filters.salaryMin}
            onChange={handleFilterChange}
            placeholder='Min Salary'
        />
        <input
            type="number"
            name="workExperienceMinYears"
            className="w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
            value={filters.workExperienceMinYears}
            onChange={handleFilterChange}
            placeholder='Min Experience ( Years )'
        />
        <div className="flex justify-end mb-4">
                <button 
                    onClick={handleReset} 
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
                >
                    Reset
                </button>
            </div>
      </div>
      {isLoading && (
        <div className="flex justify-center items-center">
          <Spinner />
        </div>
      )}
      {errorMessage && (
        <div className="text-red-500 text-center my-4">{errorMessage}</div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <JobCard key={job._id} job={job} onClick={() => handleJobClick(job._id)} />
        ))}
      </div>
    </div>
  );
};

const JobCard = ({ job, onClick }) => {
  const {
    title,
    description,
    companyName,
    locations,
    salary,
    employmentType,
    industry,
    isRemote,
    workExperienceMinYears,
  } = job;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg cursor-pointer">
      <div onClick={onClick}>
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-700 mb-4">{companyName}</p>
        <p className="text-gray-700 mb-2">{locations.join(', ')}</p>
        <p className="text-gray-700 mb-2">
          {employmentType} {isRemote ? '- Remote' : ''}
        </p>
        <div className="flex justify-between items-center">
          <p className="text-gray-700">{industry}</p>
          <p className="text-gray-700">{salary}</p>
        </div>
        <div className="flex mt-4">
          <p className="text-gray-500 mr-4">Experience: {workExperienceMinYears} years</p>
        </div>
        <p className="text-gray-500 mt-4">{description.slice(0, 100)}...</p>
      </div>
      <button
        className="mt-4 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={onClick}
      >
        View Details
      </button>
    </div>
  );
};

export default UserDashboard;





  