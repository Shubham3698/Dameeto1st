import React, { useState } from "react";
import axios from "axios";

export default function PincodeChecker() {
  const [pincode, setPincode] = useState("");
  const [status, setStatus] = useState("");
  const [location, setLocation] = useState("");
  const [estimated, setEstimated] = useState("");
  const [loading, setLoading] = useState(false);

  const BASE_URL =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
      ? "http://localhost:3000"
      : "https://serdeptry1st.onrender.com";

  const getEstimatedDate = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  const checkPincode = async () => {
    if (pincode.length !== 6 || isNaN(pincode)) {
      setStatus("❌ Enter valid pincode");
      return;
    }

    setLoading(true);
    setStatus("");
    setLocation("");
    setEstimated("");

    try {
      // 📍 Area fetch
      const areaRes = await axios.get(
        `https://api.postalpincode.in/pincode/${pincode}`
      );

      const postData = areaRes.data[0];

      if (postData.Status === "Success") {
        const place = postData.PostOffice[0];
        setLocation(`📍 ${place.District}, ${place.State}`);
      } else {
        setLocation("⚠️ Area not found");
      }

      // 🚚 Delivery check
      const res = await axios.post(
        `${BASE_URL}/api/check-pincode`,
        { pincode }
      );

      if (res.data.delivery) {
        setStatus("available");
        setEstimated(`📦 Delivery by ${getEstimatedDate(3)}`);
      } else {
        setStatus("not");
      }

    } catch (err) {
      setStatus("error");
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center px-4 mt-10">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md shadow-2xl rounded-2xl p-5 sm:p-6 border border-gray-100">
        
        <h2 className="text-lg sm:text-xl font-semibold text-center mb-4">
          Check Delivery Availability
        </h2>

        {/* Input Section */}
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Enter Pincode"
            value={pincode}
            maxLength={6}
            onChange={(e) => setPincode(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none text-sm sm:text-base"
          />

          <button
            onClick={checkPincode}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm sm:text-base"
          >
            {loading ? "Checking..." : "Check"}
          </button>
        </div>

        {/* Location */}
        {location && (
          <p className="mt-3 text-xs sm:text-sm text-gray-500 text-center">
            {location}
          </p>
        )}

        {/* Status Badge */}
        {status === "available" && (
          <p className="mt-3 text-center text-green-600 font-semibold text-sm">
            ✅ Delivery Available 🚚
          </p>
        )}

        {status === "not" && (
          <p className="mt-3 text-center text-red-500 font-semibold text-sm">
            ❌ Not Deliverable
          </p>
        )}

        {status === "error" && (
          <p className="mt-3 text-center text-yellow-500 text-sm">
            ⚠️ Server Error
          </p>
        )}

        {/* Estimated Date */}
        {estimated && (
          <p className="mt-2 text-center text-xs sm:text-sm text-gray-600">
            {estimated}
          </p>
        )}
      </div>
    </div>
  );
}