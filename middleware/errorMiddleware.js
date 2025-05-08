// Event Registration Controller (User)
exports.registerForEvent = async (req, res) => {
    try {
      const { eventId, userId } = req.body; // User ID and event ID
  
      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
  
      const currentTime = new Date();
  
      // Check if current time is before event end time
      if (currentTime > event.endTime) {
        return res.status(400).json({ error: "Event has already ended" });
      }
  
      // Create a registration entry in DB
      const newRegistration = new Registration({
        userId,
        eventId,
      });
  
      await newRegistration.save();
  
      res.status(201).json({ message: "Registered successfully for the event" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error during registration" });
    }
  };
  