import React from "react";
import aboutImg from "../assets/about_us.jpg";

import { FaHeart, FaLightbulb, FaShieldAlt, FaStar } from "react-icons/fa";
import { motion } from "framer-motion";
import { HeartPulse, Lightbulb, ShieldCheck, Star } from "lucide-react";




export default function AboutUs() {
  const sectionStyle = {
    padding: "70px 10%",
    textAlign: "center",
  };

  const headingStyle = {
    fontSize: "34px",
    color: "#0b4b82",
    marginBottom: "30px",
    fontWeight: "600",
  };

  const cardStyle = {
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  };

  const hoverEffect = {
    transform: "translateY(-5px)",
    boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
  };

  return (
    <div
      style={{
        fontFamily: "Poppins, sans-serif",
        color: "#1b1b1b",
        backgroundColor: "#f9fcff",
      }}
    >
      {/* 🌟 HERO SECTION */}
      <section
        style={{
          background: "linear-gradient(135deg, #dbeafe, #eff6ff)",
          textAlign: "center",
          padding: "90px 20px 70px",
        }}
      >
        <h1
          style={{
            fontSize: "46px",
            fontWeight: "700",
            color: "#0b4b82",
            marginBottom: "20px",
          }}
        >
          Empowering Better Health with Smart Technology
        </h1>
        <p
          style={{
            maxWidth: "850px",
            margin: "0 auto",
            fontSize: "18px",
            color: "#333",
            lineHeight: "1.7",
          }}
        >
        Our platform is designed to predict patient outcomes using advanced AI models. By integrating machine learning and healthcare data, we help doctors make informed, timely decisions that can improve patient care.
        </p>
      </section>

      {/* 🩺 WHO WE ARE */}
      <section
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "70px 10%",
          flexWrap: "wrap",
          gap: "50px",
          background: "#fff",
        }}
      >
        <img
          src={aboutImg}
          alt="About Us"
          style={{
            width: "500px",
            height: "330px",
            borderRadius: "15px",
            objectFit: "cover",
            boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
          }}
        />
        <div style={{ flex: 1, minWidth: "320px" }}>
          <h2 style={{ color: "#0b4b82", fontSize: "32px", marginBottom: "15px" }}>
            Who We Are
          </h2>
          <p style={{ fontSize: "18px", color: "#444", lineHeight: "1.8" }}>
            We are a passionate team of healthcare innovators and technology
            enthusiasts who believe that intelligent systems can revolutionize
            patient care. Our goal is to simplify healthcare management for both
            doctors and patients by offering accurate, data-driven insights.
          </p>
        </div>
      </section>
      
     {/* ❤ CORE VALUES */}
<section style={{ ...sectionStyle, background: "#fff" }}>
  <h2 style={headingStyle}>Our Core Values</h2>
  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: "30px",
    }}
  >
    {[
      {
        title: "Compassion",
        desc: "We believe empathy is at the heart of healthcare. Our solutions are designed to support doctors and patients with understanding and care, ensuring every interaction promotes comfort, respect, and trust.",
        icon: <FaHeart size={42} color="#e63946" />,
      },
      {
        title: "Innovation",
        desc: "We embrace creativity and cutting-edge technology to transform healthcare delivery. By integrating AI and data science, we constantly seek new ways to make diagnosis and patient outcome prediction faster, smarter, and more accurate.",
        icon: <FaLightbulb size={42} color="#f6c90e" />,
      },
      {
        title: "Accuracy",
        desc: "We uphold honesty, transparency, and responsibility in everything we do. Patient data privacy and ethical AI use are central to our mission — ensuring trust and reliability in our technology.",
        icon: <FaShieldAlt size={42} color="#007bff" />,
      },
      {
        title: "Operational Excellence",
        desc: "We strive for the highest quality in our technology, research, and service. Every product feature, every line of code, and every partnership reflects our dedication to excellence in digital healthcare.",
        icon: <FaStar size={42} color="#f4a261" />,
      },
    ].map((v, i) => (
      <motion.div
        key={i}
        whileHover={{ scale: 1.07 }}
        transition={{ type: "spring", stiffness: 300 }}
        style={{
          ...cardStyle,
          flex: "1 1 250px",
          padding: "30px 25px",
          cursor: "pointer",
          textAlign: "center",
        }}
        onMouseEnter={(e) =>
          Object.assign(e.currentTarget.style, hoverEffect)
        }
        onMouseLeave={(e) =>
          Object.assign(e.currentTarget.style, cardStyle)
        }
      >
        <motion.div
          whileHover={{ rotate: 10, scale: 1.2 }}
          transition={{ type: "spring", stiffness: 200 }}
          style={{ marginBottom: "15px" }}
        >
          {v.icon}
        </motion.div>
        <h3 style={{ color: "#0b4b82", marginBottom: "10px" }}>{v.title}</h3>
        <p style={{ color: "#555", fontSize: "16px", lineHeight: "1.6" }}>{v.desc}</p>
      </motion.div>
    ))}
  </div>
</section>

     {/* 🚀 OUR JOURNEY */}
<section
  style={{
    background: "#f9fcff",
    padding: "80px 10%",
    textAlign: "center",
  }}
>
  <h2
    style={{
      fontSize: "34px",
      color: "#0b4b82",
      marginBottom: "20px",
      fontWeight: "600",
    }}
  >
    Our Journey
  </h2>
  <p
    style={{
      maxWidth: "850px",
      margin: "0 auto 50px auto",
      fontSize: "18px",
      color: "#444",
      lineHeight: "1.8",
    }}
  >
    Our journey began with a simple question — how can technology make healthcare smarter
    and more compassionate? From brainstorming sessions to real development, every step
    has brought us closer to creating a meaningful impact in the healthcare world.
  </p>

  {/* 🌟 Journey timeline */}
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexWrap: "wrap",
      gap: "60px",
    }}
  >
    <img
      src={require("../assets/journey.jpg")} 
      alt="Our Journey"
      style={{
        width: "600px",
        height: "320px",
        borderRadius: "15px",
        objectFit: "cover",
        boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
        transition: "transform 0.3s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    />

    {/* Vertical timeline */}
    <div
      style={{
        position: "relative",
        paddingLeft: "30px",
        borderLeft: "3px solid #0b4b82",
        textAlign: "left",
        maxWidth: "400px",
      }}
    >
      {[
        {
          stage: "💡 Idea Stage",
          title: "The Beginning of Innovation",
          desc: "We started with one mission — to bring data-driven intelligence to healthcare and help doctors make better, faster decisions.",
        },
        {
          stage: "🧩 Development Phase",
          title: "Building the Foundation",
          desc: "We designed, coded, and refined our system, combining AI technology with medical understanding to create accurate predictions.",
        },
        {
          stage: "🚀 Launch & Growth",
          title: "Making an Impact",
          desc: "Our platform now supports smarter healthcare decisions, empowering both patients and doctors to achieve better outcomes together.",
        },
      ].map((step, i) => (
        <div
          key={i}
          style={{
            marginBottom: "40px",
            position: "relative",
            opacity: 1,
            transition: "transform 0.3s ease, opacity 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateX(10px)";
            e.currentTarget.style.opacity = "0.9";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateX(0px)";
            e.currentTarget.style.opacity = "1";
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "-45px",
              top: "0",
              background: "#0b4b82",
              color: "white",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
            }}
          >
            {step.stage.split(" ")[0]} {/* icon part */}
          </div>
          <h3 style={{ color: "#0b4b82", marginBottom: "8px" }}>
            {step.stage.replace("💡", "").replace("🧩", "").replace("🚀", "")} — {step.title}
          </h3>
          <p style={{ color: "#555", fontSize: "16px", lineHeight: "1.6" }}>
            {step.desc}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>




      {/* 📞 CTA */}
      <section
        style={{
          textAlign: "center",
          padding: "70px 20px",
          background: "linear-gradient(135deg, #c4cfddff, #eff6ff)",
        }}
      >
        <h2 style={{ color: "#0b4b82", fontSize: "32px", marginBottom: "15px" }}>
          Have Questions or Feedback?
        </h2>
        <p style={{ fontSize: "18px", color: "#333" }}>
          We'd love to hear from you —{" "}
          <a href="/contactus" style={{ color: "#007bff", textDecoration: "none" }}>
            Contact Us
          </a>{" "}
          and be part of the smart health revolution!
        </p>
      </section>
      
      {/* Footer */}
<footer
  style={{
    background: "linear-gradient(135deg, #dbeafe, #eff6ff)",
    color: "#0d47a1",
    padding: "40px 30px 25px",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "25px",
    borderTop: "3px solid #f0f3f0ff",
  }}
>
  {/* About Us Section */}
  <div style={{ flex: "1 1 280px", minWidth: "230px" }}>
    <h3 style={{ fontSize: "20px", marginBottom: "12px", color: "#0d47a1" }}>
      Patient Outcome Predictor
    </h3>
    <p style={{ fontSize: "14px", lineHeight: "1.6", color: "black", opacity: "0.9" }}>
      Empowering doctors with AI-driven insights to make smarter, faster
      ICU decisions. Our mission is to improve patient recovery and reduce
      delays through technology and compassion.
    </p>
  </div>

  {/* Quick Links Section */}
  <div style={{ flex: "1 1 160px", minWidth: "180px" }}>
    <h4 style={{ fontSize: "18px", marginBottom: "12px", color: "#0d47a1" }}>
      Quick Links
    </h4>
    <ul style={{ listStyle: "none", padding: 0, fontSize: "14px", lineHeight: "1.8" }}>
      <li><a href="/" style={{ color: "black", textDecoration: "none" }}>Home</a></li>
      <li><a href="/aboutus" style={{ color: "black", textDecoration: "none" }}>About Us</a></li>
      <li><a href="/demo" style={{ color: "black", textDecoration: "none" }}>Demo</a></li>
      <li><a href="/contactus" style={{ color: "black", textDecoration: "none" }}>Contact Us</a></li>
      <li><a href="/login" style={{ color: "black", textDecoration: "none" }}>Login</a></li>
    </ul>
  </div>

  {/* Contact Section */}
  <div style={{ flex: "1 1 250px", minWidth: "230px" }}>
    <h4 style={{ fontSize: "18px", marginBottom: "12px", color: "#0d47a1" }}>
      Contact Us
    </h4>
    <p style={{ fontSize: "14px", lineHeight: "1.6", color: "black", opacity: "0.9" }}>
      📧 <b>Email:</b> eicug621@gmail.com <br />
      ☎ <b>Phone:</b> +91 98765 43210 <br />
      🕒 <b>Hours:</b> Mon–Fri, 9:00 AM – 6:00 PM
    </p>
    <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
      <a
        href="#"
        style={{ color: "#0d47a1", fontSize: "18px", transition: "color 0.3s" }}
        onMouseOver={(e) => (e.target.style.color = "#2e7d32")}
        onMouseOut={(e) => (e.target.style.color = "#0d47a1")}
      >🌐</a>
      <a
        href="#"
        style={{ color: "#0d47a1", fontSize: "18px", transition: "color 0.3s" }}
        onMouseOver={(e) => (e.target.style.color = "#2e7d32")}
        onMouseOut={(e) => (e.target.style.color = "#0d47a1")}
      >💼</a>
      <a
        href="#"
        style={{ color: "#0d47a1", fontSize: "18px", transition: "color 0.3s" }}
        onMouseOver={(e) => (e.target.style.color = "#2e7d32")}
        onMouseOut={(e) => (e.target.style.color = "#0d47a1")}
      >📘</a>
    </div>
  </div>

  {/* Bottom Copyright */}
  <div
    style={{
      width: "100%",
      textAlign: "center",
      borderTop: "1px solid rgba(0,0,0,0.1)",
      marginTop: "25px",
      paddingTop: "10px",
      fontSize: "16px",
      opacity: "0.8",
    }}
  >
    <p style={{ marginBottom: "5px" }}>Together, we care. Together, we save lives.</p>
    <p>© 2025 Patient Outcome Predictor | Made with ❤ by Your Team</p>
  </div>
</footer>
    </div>
  );
}