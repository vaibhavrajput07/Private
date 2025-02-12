import { useState } from "react";
import { TextField, Button, Card, CardContent, Typography, Snackbar, Alert } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { pink } from "@mui/material/colors";
import { motion } from "framer-motion";

export default function LoveCalculator() {
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [result, setResult] = useState(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [emoji, setEmoji] = useState("❤️");

  const handleClose = () => {
    setOpen(false);
  };

  const isValidName = (name) => {
    return /^[a-zA-Z]+$/.test(name);  // Check for letters only
  };

  const calculateLove = async () => {
    if (!name1 || !name2) {
      setMessage("Both names are required!");
      setOpen(true);
      return;
    }

    if (!isValidName(name1) || !isValidName(name2)) {
      setMessage("Please enter valid names (letters only, no numbers or special characters).");
      setOpen(true);
      return;
    }

    if (name1 === name2) {
      setMessage("Names must be different!");
      setOpen(true);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/love-calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name1, name2 }),
      });

      const data = await response.json();

      if (data.success) {
        const lovePercentage = data.percentage;
        const loveEmoji = lovePercentage > 80 ? "😍" : lovePercentage > 50 ? "😊" : "💔";
        setResult(lovePercentage);
        setEmoji(loveEmoji);
        setMessage("Love percentage calculated successfully!");
      } else {
        setMessage("Failed to calculate love percentage.");
      }
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setOpen(true);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 gap-4 min-h-screen bg-pink-100 justify-center">
      <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }} className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl">
        <Card sx={{ padding: 3, textAlign: "center", borderRadius: "16px", backgroundColor: "#ffcccc", boxShadow: "0px 4px 10px rgba(0,0,0,0.2)" }}>
          <CardContent>
            <motion.div whileHover={{ scale: 1.2 }}>
              {result !== null && result > 50 ? (
                <FavoriteIcon sx={{ fontSize: 60, color: pink[500] }} />
              ) : (
                <FavoriteBorderIcon sx={{ fontSize: 60, color: pink[500] }} />
              )}
            </motion.div>
            <Typography variant="h5" component="h2" gutterBottom>
              Love Percentage Calculator
            </Typography>
            <TextField
              label="Enter Your Name"
              variant="outlined"
              fullWidth
              value={name1}
              onChange={(e) => setName1(e.target.value)}
              sx={{ mt: 2, backgroundColor: "white", borderRadius: "8px" }}
            />
            <TextField
              label="Enter Your Partner Name"
              variant="outlined"
              fullWidth
              value={name2}
              onChange={(e) => setName2(e.target.value)}
              sx={{ mt: 2, backgroundColor: "white", borderRadius: "8px" }}
            />
            <motion.div whileTap={{ scale: 0.9 }}>
              <Button variant="contained" color="secondary" onClick={calculateLove} fullWidth sx={{ mt: 3, borderRadius: "20px", backgroundColor: pink[500] }}>
                Calculate Love
              </Button>
            </motion.div>

            {result !== null && (
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                <Typography variant="h6" sx={{ mt: 3, fontWeight: "bold", color: "#d50000" }}>
                  Love Percentage: {result}% {emoji}
                </Typography>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert onClose={handleClose} severity="info" sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}
