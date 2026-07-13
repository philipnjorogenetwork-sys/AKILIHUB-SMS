import { useNavigate } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, ArrowLeft, MessageSquare } from "lucide-react";

const contacts = [
  {
    icon: Phone,
    label: "Phone",
    value: "+254 700 000 000",
    sub: "Mon – Fri, 8 AM – 5 PM",
  },
  {
    icon: Mail,
    label: "Email",
    value: "support@akilihub.com",
    sub: "We respond within 24 hours",
  },
  {
    icon: MapPin,
    label: "Office",
    value: "Nairobi, Kenya",
    sub: "123 School Lane, Westlands",
  },
  {
    icon: Clock,
    label: "Support Hours",
    value: "Mon – Fri: 8 AM – 5 PM",
    sub: "Weekends: 9 AM – 1 PM",
  },
];

export default function ContactUs() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-400 hover:!text-orange-500 hover:!bg-transparent mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Login
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-7 h-7 text-orange-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Contact Us</h1>
          <p className="text-gray-400 text-sm mt-1">
            Reach out to your system administrator or support team
          </p>
        </div>

        {/* Contact cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {contacts.map(({ icon: Icon, label, value, sub }) => (
            <div
              key={label}
              className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:border-orange-200 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-orange-500" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</p>
                  <p className="text-sm font-semibold text-gray-800 mt-0.5">{value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 text-center">
          <p className="text-sm text-orange-700 font-medium">Need immediate access?</p>
          <p className="text-xs text-orange-500 mt-1">
            Contact your school's system administrator to reset your credentials or grant access.
          </p>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          © {new Date().getFullYear()} Akili Hub Solutions &mdash; All rights reserved.
        </p>
      </div>
    </div>
  );
}
