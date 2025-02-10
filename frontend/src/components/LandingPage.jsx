import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import axios from "axios";
import {
  Box,
  Button,
  Typography,
  Grid,
  Paper,
  Avatar,
  Container,
  Card,
  CardContent,
  CircularProgress,
  Rating,
} from "@mui/material";
import "./LandingPage.css";

// Rotating Logo Component
const RotatingLogo = ({ scene, position, scale }) => {
  const logoRef = useRef();
  useFrame(() => {
    if (logoRef.current) {
      logoRef.current.rotation.x = Math.PI / 2;
    }
  });

  return <primitive ref={logoRef} object={scene} position={position} scale={scale} />;
};

// Static Model Component
const StaticModel = ({ scene, position, scale }) => {
  return <primitive object={scene} position={position} scale={scale} />;
};

// Circular Platform for Logo
const Platform = () => {
  return (
    <mesh position={[0, -2.5, 0]}>
      <cylinderGeometry args={[3, 3, 0.2, 32]} />
      <meshStandardMaterial color="#649860" />
    </mesh>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const { scene: logoScene } = useGLTF("/assets/models/greenspherelogo.glb");
  const { scene: textScene } = useGLTF("/assets/models/greenspheretext.glb");

  // Developer Data
  const developers = [
    { name: "Gayapa, Jhon Ludwig C.", image: "assets/images/ludwig.jpg" },
    { name: "Barte, Gwyn S.", image: "assets/images/gwyn.jpg" },
    { name: "Obreros, Jhun Mark G.", image: "assets/images/jm.jpg" },
    { name: "Prado, Kristine Mae", image: "assets/images/km.jpg" },
  ];

  // Testimonials API Fetch
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await axios.get("http://localhost:3001/feedback");
        setTestimonials(response.data);
      } catch (err) {
        setError("Failed to load testimonials.");
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  return (
    <div className="landing-container">
      {/* Hero Section */}
      <Box className="hero-section" display="flex" alignItems="center" justifyContent="space-between" py={6} bgcolor="white">
        <Box className="hero-content" textAlign="left">
          <Typography variant="h2" fontWeight="bolder" color="#548a50">
            GreenSphere
          </Typography>
          <Typography variant="h5" color="#0e0a36" paragraph>
            "A simulator for designing and applying renewable energy solutions. Start building your greener future today!"
          </Typography>
          <Button variant="contained" size="large" onClick={() => navigate("/home")}>
            Get Started
          </Button>
        </Box>

        <Box className="hero-3d" sx={{ padding: 2 }}>
          <Canvas className="canvas" camera={{ position: [0, 0, 12] }} style={{ background: "#0e0a36", borderRadius: "50px", overflow: "hidden" }}>
            <OrbitControls enableZoom={false} />
            <ambientLight intensity={1.5} />
            <directionalLight position={[2, 2, 2]} intensity={1} />
            <Platform />
            <RotatingLogo scene={logoScene} position={[0, 1.7, 0.2]} scale={[1, 1, 1]} />
            <StaticModel scene={textScene} position={[0, -1.1, 0]} scale={[0.1, 0.1, 0.1]} />
          </Canvas>
        </Box>
      </Box>

      {/* Features Section with Alternating Colors */}
      <Box sx={{ py: 6, bgcolor: "#f0f8f4" , width: "100%" }}>
      <Container>
        <Typography variant="h4" align="center" fontWeight="bold" color="#0e0a36" gutterBottom>
          Why Choose Us?
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          {[
            { title: "Eco-Friendly", desc: "We prioritize sustainability with green energy solutions tailored to meet the needs of modern living." },
            { title: "User-Friendly", desc: "Our intuitive and easy-to-use platform makes it simple for anyone to design and apply renewable energy projects." },
            { title: "Reliable", desc: "We provide well-tested, scientifically backed solutions that ensure efficiency and long-term performance." },
          ].map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">{feature.title}</Typography>
                  <Typography color="textSecondary">{feature.desc}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      </Box>
{/* Testimonials Section */}
<Container sx={{ py: 5 }}>
        <Typography variant="h4" align="center" fontWeight="bold" color="#0e0a36" gutterBottom>
          What Our Users Say
        </Typography>

        {loading ? (
          <Grid container justifyContent="center">
            <CircularProgress color="secondary" />
          </Grid>
        ) : error ? (
          <Typography align="center" color="error">{error}</Typography>
        ) : (
          <Grid container spacing={3} justifyContent="center">
            {testimonials.slice(0, 6).map((testimonial, index) => ( // Limit to first 6
              <Grid item xs={12} sm={6} md={4} key={index}> {/* 3 per row on md+ screens */}
                <Card elevation={3} sx={{ backgroundColor: "#0e0a36", color: "white", textAlign: "center", padding: 2 }}>
                  <Avatar src={testimonial.avatar || "/assets/default-avatar.png"} sx={{ width: 56, height: 56, margin: "auto" }} />
                  <Typography variant="body1" fontStyle="italic" sx={{ mt: 2 }}>
                    "{testimonial.comment}"
                  </Typography>
                  <Rating value={testimonial.rating} readOnly precision={0.5} sx={{ mt: 1 }} />
                  <Typography variant="body2" fontWeight="bold" sx={{ mt: 1 }}>
                    - {testimonial.name}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
      {/* Developers Section (Gray Background) */}
      <Box sx={{ py: 6, bgcolor: "#f0f8f4" }}>
      <Container >
        <Typography variant="h4" align="center" fontWeight="bold" color="#0e0a36" gutterBottom>
          Developers of the System
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          {developers.map((dev, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper elevation={6} className="developer-card" sx={{ textAlign: "center", padding: 3 }}>
                <Avatar src={dev.image} sx={{ width: 120, height: 120, margin: "auto" }} />
                <Typography variant="h6" color="#0e0a36" sx={{ mt: 2 }}>{dev.name}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
      </Box>

      {/* Footer Section (Dark Blue) */}
      <Box className="footer" textAlign="center" py={3} bgcolor="#0e0a36" mt={6}>
        <Typography variant="body2" color="white">© 2024 GreenSphere. All rights reserved.</Typography>
      </Box>
    </div>
  );
};

export default LandingPage;
