import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Ticket = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [expandedTicket, setExpandedTicket] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Fetch all tickets when the component mounts
  useEffect(() => {
    fetch("http://localhost:5000/api/ticket")
      .then(res => res.json())
      .then(data => setTickets(data.tikets || []));
  }, []);

  // Delete a ticket by ID
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ticket?")) return;
    const response = await fetch(`http://localhost:5000/api/ticket/${id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    if (data.success) {
      setTickets(tickets.filter(ticket => ticket._id !== id));
      alert("Ticket deleted!");
    } else {
      alert("Failed to delete ticket: " + data.message);
    }
  };

  const handleReply = async (ticketId) => {
    if (!replyText.trim()) {
      alert("Please enter a reply message");
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch(`http://localhost:5000/api/ticket/${ticketId}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reply: replyText }),
      });

      const data = await response.json();
      if (data.success) {
        // Update the ticket in the state with the new reply
        setTickets(tickets.map(ticket => 
          ticket._id === ticketId ? { ...ticket, reply: replyText } : ticket
        ));
        setReplyText("");
        setExpandedTicket(null);
        alert("Reply sent successfully!");
      } else {
        alert("Failed to send reply: " + data.message);
      }
    } catch (error) {
      alert("Error sending reply: " + error.message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Navigation Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center mb-4">
          <span className="text-2xl font-bold mr-4">
            <span className="inline-flex items-center text-indigo-600">
              <span className="mr-2">
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M4 4h16v12H5.17L4 17.17V4z" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
              Communication Center
            </span>
          </span>
          <div className="ml-8 flex space-x-6 text-lg font-medium">
            <span className="text-gray-500 hover:text-indigo-600 cursor-pointer" onClick={() => navigate('/CommuniCoPage')}>Dashboard</span>
            <span className="text-gray-500 hover:text-indigo-600 cursor-pointer" onClick={() => navigate('/addannoucement')}>New Announcement</span>
            <span className="text-gray-500 hover:text-indigo-600 cursor-pointer" onClick={() => navigate('/displayallannoucement')}>All Announcements</span>
            <span className="border-b-2 border-indigo-600 pb-1 cursor-pointer">Ticket</span>
          </div>
        </div>
      </div>

      {/* Page Title and Subtitle */}
      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold text-[#3737d4] mb-2">All Tickets</h2>
        <p className="text-lg text-gray-600">Browse, search, update, or delete support tickets.</p>
      </div>

      <div className="grid gap-6">
        {tickets.map(ticket => (
          <div 
            key={ticket._id} 
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <h3 
                  className="text-xl font-semibold text-gray-800 cursor-pointer hover:text-blue-600"
                  onClick={() => setExpandedTicket(expandedTicket === ticket._id ? null : ticket._id)}
                >
                  {ticket.subject}
                </h3>
                <button 
                  onClick={() => handleDelete(ticket._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <span className="font-medium text-gray-700 mr-2">Name:</span>
                  {ticket.name}
                </div>
                <div className="flex items-center">
                  <span className="font-medium text-gray-700 mr-2">Email:</span>
                  {ticket.email}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-gray-700 whitespace-pre-wrap">{ticket.message}</p>
              </div>

              {expandedTicket === ticket._id && (
                <div className="mt-4 space-y-4">
                  <div className="bg-blue-50 p-4 rounded-md">
                    <textarea
                      className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="4"
                      placeholder="Type your reply here..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    />
                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={() => handleReply(ticket._id)}
                        disabled={isSending}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSending ? "Sending..." : "Send Reply"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {ticket.reply && (
                <div className="bg-green-50 p-4 rounded-md border-l-4 border-green-500">
                  <p className="text-green-700 whitespace-pre-wrap">
                    <span className="font-medium">Reply:</span> {ticket.reply}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ticket;


