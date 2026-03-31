const jwt=require('jsonwebtoken')
const {config}=require('../config/dotenvConfig')

const admin = (req, res, next) => {
    try {
      // feltételezzük hogy authMiddleware már betette a usert
      if (!req.user) {
        return res.status(401).json({ message: 'Nincs bejelentkezve' });
      }
  
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Csak admin törölhet felhasználót' });
      }
  
      next();
    } catch (err) {
      res.status(500).json({ message: 'Hiba a jogosultság ellenőrzésnél' });
    }
  };

  module.exports={admin}