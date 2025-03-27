
import { useState } from 'react';
import axios from 'axios';
import Footer from '../componenets/Footer';

const AddEvent = () => {
    const [eventName, setEventName] = useState('');
    const [organizarName, setOrganizarName] = useState('');
    const [discription, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [time, setStartTime] = useState('');
    const [venue, setVenue] = useState('');
    const [organizarContactNo, setOrganizarContactNo] = useState('');
    const [organizarEmail, setOrganizarEmail] = useState('');
    const [expectedCount, setExpectedCount] = useState(0);
    const [requestType, setRequestType] = useState(''); 
    const [error, setError] = useState('');

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        if (!/^\d{10}$/.test(organizarContactNo)) {
            setError("Contact number must be exactly 10 digits.");
            return;
        } else {
            setError("");
        }

        try {
            const formData = {
                eventName,
                organizarName,
                discription,
                date,
                time,
                venue,
                organizarContactNo,
                organizarEmail,
                expectedCount,
                requestType, 
            };

            console.log("Form data being sent:", formData);

            const { data } = await axios.post('http://localhost:5000/api/event/add-event', formData);

            if (data.success) {
                console.log("Event added successfully");
                alert('Event added successfully');
            } else {
                console.error("Failed to add event: ", data.message);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    return (
        <div>
            <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
                <form onSubmit={onSubmitHandler} className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
                    <h1 className="text-3xl font-bold mb-8 text-center">Create a New Event</h1>

                    <label className="block mb-4">
                        <span className="text-gray-700">Event Name:</span>
                        <input
                            name="eventName"
                            type="text"
                            onChange={(e) => setEventName(e.target.value)}
                            value={eventName}
                            required
                            placeholder="Enter event name"
                            className="mt-1 p-2 w-full border rounded-md"
                        />
                    </label>

                    <label className="block mb-4">
                        <span className="text-gray-700">Organizer Name:</span>
                        <input
                            name="organizarName"
                            type="text"
                            onChange={(e) => setOrganizarName(e.target.value)}
                            value={organizarName}
                            required
                            placeholder="Enter organizer name"
                            className="mt-1 p-2 w-full border rounded-md"
                        />
                    </label>

                    <label className="block mb-4">
                        <span className="text-gray-700">Description:</span>
                        <textarea
                            name="discription"
                            type="text"
                            onChange={(e) => setDescription(e.target.value)}
                            value={discription}
                            required
                            placeholder="Enter event description"
                            className="mt-1 p-2 w-full border rounded-md"
                        ></textarea>
                    </label>

                    <label className="block mb-4">
                        <span className="text-gray-700">Date:</span>
                        <input
                            name="date"
                            type="date"
                            onChange={(e) => setDate(e.target.value)}
                            value={date}
                            required
                            className="mt-1 p-2 w-full border rounded-md"
                        />
                    </label>

                    <label className="block mb-4">
                        <span className="text-gray-700">Start Time:</span>
                        <input
                            name="time"
                            type="time"
                            onChange={(e) => setStartTime(e.target.value)}
                            value={time}
                            required
                            placeholder="Enter event start time"
                            className="mt-1 p-2 w-full border rounded-md"
                        />
                    </label>

                    <label className="block mb-4">
                        <span className="text-gray-700">Venue:</span>
                        <input
                            name="venue"
                            type="text"
                            onChange={(e) => setVenue(e.target.value)}
                            value={venue}
                            required
                            placeholder="Enter event venue"
                            className="mt-1 p-2 w-full border rounded-md"
                        />
                    </label>

                    <label className="block mb-4">
                        <span className="text-gray-700">Organizer Contact Number:</span>
                        <input
                            name="organizarContactNo"
                            type="text"
                            onChange={(e) => setOrganizarContactNo(e.target.value)}
                            value={organizarContactNo}
                            required
                            placeholder="Enter contact number"
                            className="mt-1 p-2 w-full border rounded-md"
                        />
                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                    </label>

                    <label className="block mb-4">
                        <span className="text-gray-700">Organizer Email:</span>
                        <input
                            name="organizarEmail"
                            type="email"
                            onChange={(e) => setOrganizarEmail(e.target.value)}
                            value={organizarEmail}
                            required
                            placeholder="Enter organizer email"
                            className="mt-1 p-2 w-full border rounded-md"
                        />
                    </label>

                    <label className="block mb-4">
                        <span className="text-gray-700">Expected Count:</span>
                        <input
                            name="expectedCount"
                            type="number"
                            onChange={(e) => setExpectedCount(Number(e.target.value))}
                            value={expectedCount}
                            min="0"
                            required
                            placeholder="Enter expected attendees"
                            className="mt-1 p-2 w-full border rounded-md"
                        />
                    </label>

                    <label className="block mb-6">
                        <span className="text-gray-700">Request Type:</span>
                        <select
                            name="requestType"
                            value={requestType}
                            onChange={(e) => setRequestType(e.target.value)}
                            className="mt-1 p-2 w-full border rounded-md"
                        >
                            <option value="">Select a request type</option>
                            <option value="Request to Join">Request to Join</option>
                            <option value="All In">All In</option>
                        </select>
                    </label>

                    <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-lg w-full hover:bg-blue-700">
                        Submit
                    </button>
                </form>
            </div>
            <Footer />
        </div>
    );
};

export default AddEvent;
