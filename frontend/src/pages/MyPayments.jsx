import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";

const MyPayments = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const fetchUserEmail = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login to view your payments");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/ProfileRouter/displayMember", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data && response.data.Member && response.data.Member.email) {
          setUserEmail(response.data.Member.email);
          fetchPayments(response.data.Member.email);
        } else {
          setError("Could not fetch user information");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load user information");
        setLoading(false);
      }
    };

    const fetchPayments = async (email) => {
      try {
        const response = await axios.get(`http://localhost:5000/api/payments/user/${email}`);
        setPayments(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching payments:", error);
        setError("Failed to load payment history. Please try again later.");
        setLoading(false);
      }
    };

    fetchUserEmail();
  }, []);

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "paid":
        return <FaCheckCircle className="text-green-500" />;
      case "pending":
        return <FaClock className="text-yellow-500" />;
      default:
        return <FaTimesCircle className="text-red-500" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-sky-950 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your payment history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/")}
              className="bg-sky-950 text-white px-6 py-3 rounded-lg hover:bg-sky-900 transition-colors"
            >
              Return to Home
            </button>
            <button
              onClick={() => navigate("/login")}
              className="bg-white text-sky-950 border-2 border-sky-950 px-6 py-3 rounded-lg hover:bg-sky-50 transition-colors"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">My Payment History</h1>
          <p className="text-gray-600">View all your payment transactions</p>
          {userEmail && (
            <p className="text-sm text-gray-500 mt-2">Email: {userEmail}</p>
          )}
        </div>

        {payments.length === 0 ? (
          <div className="text-center bg-white p-8 rounded-lg shadow">
            <p className="text-gray-600">No payment history found.</p>
            <button
              onClick={() => navigate("/buy")}
              className="mt-4 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-sky-950 hover:bg-sky-900 transition-colors"
            >
              Make Your First Payment
            </button>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments.map((payment) => (
                    <tr key={payment._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{payment.planId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">Rs. {payment.amount}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(payment.date)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(payment.status)}
                          <span className="text-sm text-gray-900 capitalize">{payment.status}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/buy")}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-sky-950 hover:bg-sky-900 transition-colors"
          >
            Make New Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyPayments; 