import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createOrder,
  upgradeToPremium,
  getSubscriptionStatus,
} from "../../redux/slices/subscriptionSlice";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import {
  Crown,
  Check,
  Star,
  Zap,
  Shield,
  Users,
  ArrowRight,
  CreditCard,
} from "lucide-react";
import Header from "../Header";
import Footer from "../Footer";

const features = {
  free: [
    "Create and edit profile",
    "Browse profiles",
    "Send likes (limited)",
    "Basic support",
  ],
  premium: [
    "All Free features",
    "See who liked you",
    "Unlimited likes",
    "Priority support",
    "Access to premium profiles",
    "Advanced search filters",
    "Profile highlighting",
    "Direct messaging",
  ],
};

const SubscriptionPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, loading, error, upgradeLoading, upgradeSuccess, order } =
    useSelector((state) => state.subscription);
  const { darkMode } = useTheme();
  const isLoggedIn =
    localStorage.getItem("isLoggedIn") === "true" &&
    !!localStorage.getItem("token");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      dispatch(getSubscriptionStatus(token));
    }
  }, [dispatch, token]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

 const handleUpgrade = async () => {
   if (!token) return;

   try {
     // Step 1: Create Razorpay order
     const orderResponse = await dispatch(createOrder(token)).unwrap();
     if (!orderResponse || !orderResponse.data) {
       console.error("Failed to create order", orderResponse);
       return;
     }

     // Step 2: Initialize Razorpay checkout
     const options = {
       key: orderResponse.data.key,
       amount: orderResponse.data.amount,
       currency: orderResponse.data.currency,
       order_id: orderResponse.data.orderId,
       handler: async function (response) {
         console.log("Razorpay payment success", response);
         const paymentData = {
           razorpay_payment_id: response.razorpay_payment_id,
           razorpay_order_id: response.razorpay_order_id,
           razorpay_signature: response.razorpay_signature,
         };
         try {
           await dispatch(upgradeToPremium({ token, paymentData })).unwrap();
           await dispatch(getSubscriptionStatus(token)); // Refresh status
         } catch (error) {
           console.error("Upgrade failed", error);
         }
       },
       prefill: {
         name: "Customer Name",
         email: "customer@example.com",
         contact: "+919876543210",
       },
       theme: {
         color: darkMode ? "#ffffff" : "#000000",
       },
       modal: {
         ondismiss: () => console.log("Checkout dismissed"),
       },
     };

     const script = document.createElement("script");
     script.src = "https://checkout.razorpay.com/v1/checkout.js";
     script.onload = () => {
       const rzp = new window.Razorpay(options);
       rzp.open();
     };
     document.body.appendChild(script);

     return () => {
       document.body.removeChild(script);
     };
   } catch (error) {
     console.error("Payment process error", error);
   }
 };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <Header showAllLinks={true} isLoggedIn={isLoggedIn} />

      <section
        className={`relative overflow-hidden ${
          darkMode
            ? "bg-gray-800"
            : "bg-gradient-to-br from-red-50 via-pink-50 to-orange-50"
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-pink-500/5"></div>
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-8">
              <div
                className={`p-6 rounded-full ${
                  darkMode ? "bg-red-500/20" : "bg-red-500/10"
                } shadow-lg`}
              >
                <Crown
                  className={`w-16 h-16 ${
                    darkMode ? "text-red-400" : "text-red-500"
                  }`}
                />
              </div>
            </div>
            <h1
              className={`text-6xl md:text-7xl font-bold mb-8 ${
                darkMode ? "text-white" : "text-gray-900"
              } leading-tight`}
            >
              Choose Your Plan
            </h1>
            <p
              className={`text-xl md:text-2xl ${
                darkMode ? "text-gray-300" : "text-gray-600"
              } max-w-3xl mx-auto leading-relaxed mb-12`}
            >
              Unlock premium features to enhance your matrimony journey and find
              your perfect match faster.
            </p>
            <div className="flex justify-center">
              <div
                className={`inline-flex items-center px-6 py-3 rounded-full ${
                  darkMode ? "bg-red-500/20" : "bg-red-500/10"
                } ${darkMode ? "text-red-400" : "text-red-600"} font-medium`}
              >
                <Star className="w-5 h-5 mr-2" />
                <span>Premium Features Available</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div
              className={`group p-10 rounded-3xl ${
                darkMode ? "bg-gray-800" : "bg-white"
              } shadow-xl hover:shadow-2xl transition-all duration-500 border-2 ${
                darkMode ? "border-gray-700" : "border-gray-200"
              } hover:scale-105`}
            >
              <div className="text-center mb-8">
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${
                    darkMode ? "bg-gray-700" : "bg-gray-100"
                  } mb-6`}
                >
                  <Users
                    className={`w-8 h-8 ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  />
                </div>
                <h3
                  className={`text-3xl font-bold mb-4 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Free Plan
                </h3>
                <p
                  className={`text-lg ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  } mb-6`}
                >
                  Perfect for getting started with your matrimony journey
                </p>
                <div className="mb-8">
                  <span
                    className={`text-4xl font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    ₹0
                  </span>
                  <span
                    className={`text-lg ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {" "}
                    /month
                  </span>
                </div>
              </div>
              <div className="space-y-4 mb-8">
                {features.free.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <div
                      className={`p-1 rounded-full ${
                        darkMode ? "bg-green-500/20" : "bg-green-100"
                      } mr-4`}
                    >
                      <Check
                        className={`w-4 h-4 ${
                          darkMode ? "text-green-400" : "text-green-500"
                        }`}
                      />
                    </div>
                    <span
                      className={`${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
              <button
                className={`w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 ${
                  status?.data?.subscription?.plan === "free"
                    ? darkMode
                      ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : darkMode
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
                disabled
              >
                Current Plan
              </button>
            </div>

            <div
              className={`group p-10 rounded-3xl ${
                darkMode ? "bg-gray-800" : "bg-white"
              } shadow-xl hover:shadow-2xl transition-all duration-500 border-2 ${
                darkMode ? "border-red-500/50" : "border-red-500"
              } hover:scale-105 relative overflow-hidden`}
            >
              <div className="absolute top-6 right-6">
                <div
                  className={`px-4 py-2 rounded-full ${
                    darkMode ? "bg-red-500/20" : "bg-red-100"
                  } ${
                    darkMode ? "text-red-400" : "text-red-600"
                  } text-sm font-semibold flex items-center`}
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Premium
                </div>
              </div>
              <div className="text-center mb-8">
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${
                    darkMode ? "bg-red-500/20" : "bg-red-100"
                  } mb-6`}
                >
                  <Crown
                    className={`w-8 h-8 ${
                      darkMode ? "text-red-400" : "text-red-500"
                    }`}
                  />
                </div>
                <h3
                  className={`text-3xl font-bold mb-4 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Premium Plan
                </h3>
                <p
                  className={`text-lg ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  } mb-6`}
                >
                  Unlock advanced features for the best matchmaking experience
                </p>
                <div className="mb-8">
                  <span
                    className={`text-4xl font-bold ${
                      darkMode ? "text-red-400" : "text-red-500"
                    }`}
                  >
                    ₹501
                  </span>
                  <span
                    className={`text-lg ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {" "}
                    /year
                  </span>
                </div>
              </div>
              <div className="space-y-4 mb-8">
                {features.premium.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <div
                      className={`p-1 rounded-full ${
                        darkMode ? "bg-red-500/20" : "bg-red-100"
                      } mr-4`}
                    >
                      <Check
                        className={`w-4 h-4 ${
                          darkMode ? "text-red-400" : "text-red-500"
                        }`}
                      />
                    </div>
                    <span
                      className={`${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
              <button
                onClick={handleUpgrade}
                className={`w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 ${
                  upgradeLoading ||
                  status?.data?.subscription?.plan === "premium"
                    ? darkMode
                      ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : darkMode
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-red-500 hover:bg-red-600 text-white"
                } shadow-lg hover:shadow-xl transform hover:scale-105`}
                disabled={
                  upgradeLoading ||
                  status?.data?.subscription?.plan === "premium"
                }
              >
                <span className="flex items-center justify-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  {upgradeLoading
                    ? "Processing..."
                    : status?.data?.subscription?.plan === "premium"
                    ? "Already Premium"
                    : "Upgrade to Premium"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div
            className={`p-12 rounded-3xl ${
              darkMode ? "bg-gray-800" : "bg-white"
            } shadow-2xl border ${
              darkMode ? "border-gray-700" : "border-gray-100"
            } max-w-4xl mx-auto`}
          >
            <div className="text-center mb-12">
              <h3
                className={`text-4xl font-bold mb-6 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Why Choose Premium?
              </h3>
              <p
                className={`text-xl ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                } leading-relaxed`}
              >
                Get access to advanced features that will help you find your
                perfect match faster and more efficiently.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div
                className={`p-6 rounded-2xl ${
                  darkMode ? "bg-gray-700" : "bg-gray-50"
                } text-center transition-all duration-300 hover:scale-105`}
              >
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${
                    darkMode ? "bg-red-500/20" : "bg-red-100"
                  } mb-4`}
                >
                  <Zap
                    className={`w-6 h-6 ${
                      darkMode ? "text-red-400" : "text-red-500"
                    }`}
                  />
                </div>
                <h4
                  className={`text-xl font-semibold mb-3 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Priority Access
                </h4>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Get your profile featured and receive priority support
                </p>
              </div>
              <div
                className={`p-6 rounded-2xl ${
                  darkMode ? "bg-gray-700" : "bg-gray-50"
                } text-center transition-all duration-300 hover:scale-105`}
              >
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${
                    darkMode ? "bg-red-500/20" : "bg-red-100"
                  } mb-4`}
                >
                  <Shield
                    className={`w-6 h-6 ${
                      darkMode ? "text-red-400" : "text-red-500"
                    }`}
                  />
                </div>
                <h4
                  className={`text-xl font-semibold mb-3 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Verified Profiles
                </h4>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Access to premium profiles with enhanced verification
                </p>
              </div>
              <div
                className={`p-6 rounded-2xl ${
                  darkMode ? "bg-gray-700" : "bg-gray-50"
                } text-center transition-all duration-300 hover:scale-105`}
              >
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${
                    darkMode ? "bg-red-500/20" : "bg-red-100"
                  } mb-4`}
                >
                  <Users
                    className={`w-6 h-6 ${
                      darkMode ? "text-red-400" : "text-red-500"
                    }`}
                  />
                </div>
                <h4
                  className={`text-xl font-semibold mb-3 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Advanced Matching
                </h4>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Use advanced filters to find your perfect match
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div
            className={`p-12 rounded-3xl ${
              darkMode ? "bg-gray-800" : "bg-white"
            } shadow-2xl border ${
              darkMode ? "border-gray-700" : "border-gray-100"
            } max-w-4xl mx-auto text-center`}
          >
            <h3
              className={`text-4xl font-bold mb-6 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Ready to Upgrade?
            </h3>
            <p
              className={`text-xl ${
                darkMode ? "text-gray-300" : "text-gray-600"
              } mb-10 leading-relaxed`}
            >
              Join thousands of premium users who have found their perfect match
              with advanced features.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                onClick={() => navigate("/contact")}
                className={`group flex items-center justify-center px-10 py-4 rounded-full font-semibold text-lg transition-all duration-300 ${
                  darkMode
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-red-500 hover:bg-red-600 text-white"
                } shadow-xl hover:shadow-2xl transform hover:scale-105`}
              >
                <span>Contact Support</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate("/explore")}
                className={`group flex items-center justify-center px-10 py-4 rounded-full font-semibold text-lg transition-all duration-300 ${
                  darkMode
                    ? "bg-transparent border-2 border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                    : "bg-transparent border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                } shadow-xl hover:shadow-2xl transform hover:scale-105`}
              >
                <span>Explore Profiles</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SubscriptionPage;
