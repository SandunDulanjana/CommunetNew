import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Footer from '../componenets/Footer';
import rulesImg from '../assets/rules.jpg';

const DisplayRules = () => {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/rules/displayrule');
        setRules(res.data.Allrules || []);
      } catch (err) {
        setRules([]);
      }
      setLoading(false);
    };
    fetchRules();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-100">Loading...</div>;

  return (
    <div>
      <section className="relative h-[40vh] bg-blue-600 mt-10">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <img
          src={rulesImg}
          alt="Community Rules"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">Community Rules</h1>
            <p className="text-xl">Please read and follow our community guidelines</p>
          </div>
        </div>
      </section>
              
      <div className="min-h-screen bg-gray-100 py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-blue-900 mb-8 text-center">Community Rules</h1>
          <div className="space-y-6">
            {rules.length === 0 ? (
              <div className="text-center text-gray-500">No rules found.</div>
            ) : (
              rules.map(rule => (
                <div key={rule._id} className="bg-white rounded-xl shadow p-6">
                  <h2 className="text-xl font-semibold text-blue-800 mb-2">{rule.Rule_subject}</h2>
                  <p className="text-gray-700">{rule.discription}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DisplayRules; 