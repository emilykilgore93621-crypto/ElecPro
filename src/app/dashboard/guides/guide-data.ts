
export type GuideContent = {
    title: string;
    steps: string[];
    materials: string[];
    proTips?: string[];
    safetyNotes?: string;
};

export const guideData: { [key: string]: GuideContent } = {
    "outlets": {
        title: "Standard Outlet",
        steps: [
            "Turn off power at the circuit breaker and verify with a voltage tester.",
            "Unscrew and remove the faceplate.",
            "Unscrew the old outlet from the electrical box.",
            "Carefully pull the outlet out and disconnect the wires (hot, neutral, ground).",
            "Connect the wires to the new outlet: black (hot) to the brass screw, white (neutral) to the silver screw, and bare copper (ground) to the green screw.",
            "Gently push the new outlet back into the box and secure it with screws.",
            "Attach the new faceplate and restore power."
        ],
        materials: ["New outlet", "Screwdriver (Phillips and flat-head)", "Voltage tester", "Wire strippers (optional)"],
        proTips: [
            "Use the holes on the back for wire insertion for a quicker connection, but wrapping the wire around the screw provides a more secure connection.",
            "If the box is metal, ensure the ground wire also connects to the box.",
            "Take a picture of the old wiring before disconnecting anything."
        ]
    },
    "switches": {
        title: "Single-Pole Switch",
        steps: [
            "Turn off power at the breaker and verify with a voltage tester.",
            "Remove the switch plate.",
            "Unscrew the switch from the box and pull it out.",
            "Disconnect the two hot wires and the ground wire from the old switch.",
            "Connect the two hot wires to the two brass screws on the new switch (order doesn't matter for a single-pole).",
            "Connect the ground wire to the green screw.",
            "Screw the new switch into the box, attach the faceplate, and turn the power back on."
        ],
        materials: ["Single-pole switch", "Screwdriver", "Voltage tester", "Pliers"],
        proTips: [
            "For a standard switch, both wires connected to it are 'hot'. One brings power in, the other sends power to the fixture.",
            "Make sure the 'ON' and 'OFF' markings on the switch are oriented correctly before tightening."
        ]
    },
    "gfci": {
        title: "GFCI Outlet",
        steps: [
            "Turn off power and verify with a voltage tester.",
            "Identify the 'LINE' and 'LOAD' terminals on your old outlet if it's protecting other outlets downstream. The 'LINE' wires are the ones that are still hot if you disconnect everything and turn the power back on (be careful!).",
            "Disconnect all wires.",
            "Connect the incoming power (LINE) wires to the 'LINE' terminals on the GFCI outlet.",
            "If protecting other outlets, connect the downstream wires to the 'LOAD' terminals.",
            "Connect the ground wire to the green screw.",
            "Install the outlet, attach the faceplate with the 'GFCI Protected' sticker, and restore power.",
            "Test the outlet using the 'TEST' and 'RESET' buttons."
        ],
        materials: ["GFCI outlet", "Screwdriver", "Voltage tester", "Wire labels (optional)"],
        proTips: [
            "If you're unsure which wires are LINE, connect only one pair, restore power, and see if the GFCI works. If it does, those are the LINE wires.",
            "A single GFCI outlet can protect all subsequent outlets on the same circuit."
        ],
        safetyNotes: "Incorrectly wiring LINE and LOAD terminals is a common and dangerous mistake. The test button may work, but the outlet will not provide downstream protection. Always double-check your connections."
    },
    "ceiling-fan": {
        title: "Ceiling Fan",
        steps: [
            "Turn off power at the breaker.",
            "Ensure the electrical box is fan-rated. If not, replace it with a fan-rated electrical box.",
            "Install the mounting bracket to the electrical box.",
            "Assemble the fan motor, downrod, and canopy according to the manufacturer's instructions.",
            "Hang the fan assembly from the mounting bracket.",
            "Wire the fan: connect house ground to fan ground, house neutral (white) to fan neutral, and house hot (black) to the fan's hot wires (usually black for motor, blue for light).",
            "Secure the canopy to the mounting bracket.",
            "Attach the fan blades and light kit.",
            "Restore power and test all fan and light functions."
        ],
        materials: ["Ceiling fan kit", "Fan-rated electrical box", "Screwdriver", "Wrench set", "Ladder", "Voltage tester"],
        proTips: [
            "Assemble as much as possible on the ground to minimize time on the ladder.",
            "Use wire nuts to secure connections and wrap with electrical tape for extra security.",
            "Balance the fan using the included balancing kit to prevent wobbling."
        ],
        safetyNotes: "Standard electrical boxes are not strong enough to support the weight and vibration of a ceiling fan. You MUST use a fan-rated box."
    },
    "smart-switch": {
        title: "Smart Switch",
        steps: [
            "Turn off power at the breaker. Smart switches require a neutral wire, so ensure your box has one (usually a bundle of white wires).",
            "Remove the old switch and disconnect the wires.",
            "Identify the hot, load, neutral, and ground wires in your box.",
            "Connect the wires to the new smart switch according to its manual (Hot -> Line, Load -> To fixture, Neutral -> Neutral, Ground -> Ground).",
            "Carefully fit the larger smart switch body and wires into the box.",
            "Screw it in, attach the faceplate, and restore power.",
            "Follow the manufacturer's app instructions to connect the switch to your Wi-Fi network."
        ],
        materials: ["Smart switch", "Screwdriver", "Voltage tester", "Wire nuts"],
        proTips: [
            "The most common issue is the lack of a neutral wire in older homes. Check for this before you buy a switch.",
            "Smart switches are bulkier than regular switches. You may need to neatly organize wires to make them fit."
        ],
        safetyNotes: "Smart switches will not work without a neutral wire. Connecting them improperly can damage the switch or be a fire hazard."
    },
    "usb-outlet": {
        title: "USB Outlet",
        steps: [
            "Turn off power at the circuit breaker and verify it's off.",
            "Remove the faceplate and unscrew the existing outlet.",
            "Pull the outlet from the box and disconnect the hot, neutral, and ground wires.",
            "Connect the corresponding wires to the new USB outlet (black to brass 'Hot', white to silver 'Neutral', copper to green 'Ground').",
            "USB outlets are bulky. Carefully fold the wires and push the new outlet into the box.",
            "Screw the outlet into place, install the faceplate, and turn the power back on.",
            "Test both the AC plugs and the USB ports."
        ],
        materials: ["USB outlet", "Screwdriver", "Voltage tester"],
        proTips: [
            "Choose a USB outlet with a high amperage rating (e.g., 3.1A or higher) for faster charging.",
            "Some USB outlets are too deep for shallow 'pancake' electrical boxes. Check your box depth first."
        ]
    },
    "dishwasher": {
        title: "Dishwasher Electrical",
        steps: [
            "Turn off the dedicated circuit breaker for the dishwasher.",
            "Locate the junction box, usually under the sink or behind the dishwasher.",
            "Disconnect the old dishwasher's electrical whip (hot, neutral, ground) from the house wiring inside the junction box.",
            "Connect the new dishwasher's electrical whip. Use wire nuts to connect black to black, white to white, and ground to ground.",
            "Ensure the connections are secure and the junction box cover is replaced.",
            "Ensure a strain relief clamp is used where the electrical whip enters the dishwasher's junction box.",
            "Restore power only after all water connections are also complete and checked for leaks."
        ],
        materials: ["Wire nuts", "Screwdriver", "Voltage tester", "Strain relief connector"],
        proTips: [
            "Dishwashers must be on a dedicated circuit. Do not share with other appliances like a garbage disposal.",
            "Leave a service loop of wire and water line behind the dishwasher to make it easier to pull out for service."
        ],
        safetyNotes: "Water and electricity are a dangerous combination. Ensure all connections are tight and the junction box is properly sealed and secured."
    },
    "hot-water-heater": {
        title: "Electric Water Heater",
        steps: [
            "Turn off the double-pole circuit breaker for the water heater.",
            "Drain the tank completely by connecting a hose to the drain valve.",
            "Disconnect the electrical conduit from the junction box on top of the heater.",
            "Disconnect the hot and neutral wires (usually black and red/white) and the ground wire.",
            "Disconnect the hot and cold water pipes.",
            "Remove the old heater and position the new one.",
            "Reconnect the water pipes using new flexible connectors if possible.",
            "Rewire the electrical connections: connect the two hot wires and the ground wire.",
            "Close the drain valve and fill the tank completely with water before restoring power.",
            "Turn the circuit breaker back on and set the thermostat."
        ],
        materials: ["New electric water heater", "Screwdriver", "Wrenches", "Pipe dope or Teflon tape", "Voltage tester", "Flexible water connectors"],
        proTips: [
            "Always fill the tank with water before turning on the power to avoid burning out the heating elements.",
            "It's a good idea to replace the temperature and pressure (T&P) relief valve.",
            "Check local codes for requirements like expansion tanks or drain pans."
        ],
        safetyNotes: "A 240V circuit is dangerous. Verify power is off at the breaker and at the heater's junction box with a voltage tester. If you see two linked breakers for one appliance, that is a double-pole breaker."
    },
    "rv-wiring": {
        title: "RV / Trailer Wiring",
        steps: [
            "Ensure the shore power pedestal breaker is OFF before plugging in.",
            "Connect your heavy-gauge shore power cord from the pedestal to your RV's inlet.",
            "Turn on the pedestal breaker. Your RV's main panel should now be energized.",
            "AC power is routed through the main fuses/breakers to your branch AC loads (outlets, microwave, A/C).",
            "AC power also supplies the Converter/Charger, which transforms 120V AC into ~13.6V DC.",
            "The DC output from the converter charges your battery bank and powers the 12V fuse panel.",
            "The 12V fuse panel distributes power to all DC loads like lights, water pump, and furnace fans.",
            "The chassis of the RV is typically grounded for the 12V system."
        ],
        materials: [
            "Shore Power Cord (30A or 50A as required)",
            "RV Fused Main Panel",
            "Converter/Charger unit",
            "12V DC Fuse Panel",
            "Deep Cycle Battery Bank",
            "Appropriately sized wiring for AC and DC systems"
        ],
        proTips: [
            "Always use a surge protector or EMS (Electrical Management System) between the pedestal and your RV to protect against faulty park power.",
            "Regularly check your battery water levels (for lead-acid batteries) and clean the terminals.",
            "Understand the difference between your converter (charges batteries when on shore power) and your inverter (creates AC power from your batteries when off-grid)."
        ],
        safetyNotes: "RV electrical systems involve both 120V AC and 12V DC. Both can be dangerous. Never work on the system with shore power connected or the batteries engaged unless you are a qualified technician. Reverse polarity at a pedestal can cause serious damage."
    },
    "cameras": {
        title: "Security Camera",
        steps: [
            "Plan camera locations for optimal coverage and access to power.",
            "For wired cameras, run the power and video (Ethernet/PoE) cables from your central hub (DVR/NVR) to the camera locations.",
            "Mount the camera bracket securely to the wall or eave.",
            "Connect the cables to the camera.",
            "Attach the camera to the bracket and adjust the viewing angle.",
            "For wireless cameras, ensure a strong Wi-Fi signal at the mounting location and connect the power adapter.",
            "Complete the setup process using the manufacturer's mobile app or software."
        ],
        materials: ["Security camera kit (cameras, cables, DVR/NVR)", "Drill", "Screwdriver", "Ladder", "Fish tape (for running wires)"],
        proTips: [
            "Install cameras high enough to be out of easy reach but low enough for clear facial recognition.",
            "Hide wires in conduit or within walls for a clean and secure installation.",
            "Consider using cameras with PoE (Power over Ethernet) to run both power and data through a single cable."
        ]
    },
    "garbage-disposal": {
        title: "Garbage Disposal",
        steps: [
            "Turn off power at the breaker. Place a bucket under the sink.",
            "Disconnect the dishwasher drain hose from the disposal, if applicable.",
            "Disconnect the disposal from the sink flange, usually with a twist-lock mechanism.",
            "Unwire the disposal from the power source in its junction box.",
            "Install the new sink flange and mounting assembly.",
            "Wire the new disposal, connecting the power cord or house wiring.",
            "Lift the new disposal into place and lock it onto the mounting ring.",
            "Reconnect the P-trap and dishwasher drain line. If it's a new installation, knock out the dishwasher plug on the disposal.",
            "Restore power, run water, and check for leaks and proper operation."
        ],
        materials: ["Garbage disposal", "Plumber's putty", "Screwdriver", "Pliers", "Hammer"],
        proTips: [
            "If replacing an old unit, the process is much easier. The new unit will often fit the existing sink flange and wiring.",
            "Use a car jack or a stack of books to help lift and hold the heavy disposal in place while you secure it."
        ],
        safetyNotes: "Never put your hands inside the disposal. Use tongs to retrieve foreign objects. Always ensure power is off before working."
    },
    "ranges-and-hoods": {
        title: "Range & Hood",
        steps: [
            "Turn off power to both the range and hood at the breaker. Ranges are typically 240V.",
            "For the Hood: Disconnect wiring, unmount the old hood, and mount the new one. Connect matching wires (hot, neutral, ground) and secure.",
            "For the Range: Unplug the old range. The new range will have a specific plug type (3-prong or 4-prong). Ensure it matches your outlet. If not, you may need to replace the range cord.",
            "Slide the new range into place, plug it in, and turn on the power.",
            "Ensure the anti-tip bracket is properly installed."
        ],
        materials: ["Range Hood", "Electric Range", "Screwdriver", "Voltage tester", "4-prong range cord (if needed)"],
        proTips: [
            "Ensure your cabinet height and width will accommodate the new hood.",
            "A 4-wire circuit (with a separate neutral and ground) is the modern standard for ranges and is safer."
        ],
        safetyNotes: "240V circuits are dangerous. Never attempt to change the outlet yourself unless you are qualified. Always use an anti-tip bracket for the range to prevent accidents."
    },
    "weather-tight": {
        title: "Weather-Tight Outlet",
        steps: [
            "Turn off power at the circuit breaker.",
            "Remove the old outdoor outlet and cover.",
            "Inspect the electrical box for damage from moisture.",
            "Connect the new weather-resistant (WR) GFCI outlet, ensuring you connect to the LINE terminals.",
            "Place the foam gasket that comes with the new cover over the outlet.",
            "Screw the new 'in-use' or 'bubble' cover baseplate to the outlet.",
            "Attach the cover itself. Restore power and test the GFCI."
        ],
        materials: ["Weather-Resistant (WR) GFCI Outlet", "In-use 'bubble' cover", "Screwdriver", "Voltage Tester"],
        proTips: [
            "Use 'in-use' covers that are deep enough to keep plugs connected and protected from rain.",
            "Ensure all outdoor outlets are GFCI protected for safety."
        ],
        safetyNotes: "Water and electricity are a deadly combination. Ensure the cover is rated for wet locations and seals properly."
    },
    "circuit-breakers": {
        title: "Circuit Breaker Safety",
        steps: [
            "Understanding Your Panel: The main breaker (usually at the top) shuts off all power. Individual breakers control separate circuits.",
            "Tripping: A breaker trips to protect the circuit from overload or a short. It will move to the middle or 'OFF' position.",
            "Resetting a Tripped Breaker: To reset, push the breaker handle firmly to the 'OFF' position first, then back to 'ON'.",
            "Identifying Overloads: If a breaker trips immediately after resetting, you likely have too many devices on that circuit. Unplug some and try again.",
            "Identifying a Short Circuit: If it trips immediately with nothing plugged in, or makes a sparking sound, you may have a dangerous short circuit. Do not reset it again and call an electrician."
        ],
        materials: ["Flashlight", "Basic knowledge of your home's layout"],
        proTips: [
            "Label your breaker panel clearly and accurately. This is crucial in an emergency.",
            "Test GFCI and AFCI breakers monthly using their 'TEST' buttons."
        ],
        safetyNotes: "Never touch the metal bus bars inside a panel. Never force a breaker to stay on. If a breaker feels hot, smells like burning, or trips repeatedly, contact a qualified electrician immediately."
    },
    "safe-wiring": {
        title: "Safe Wiring Practices",
        steps: [
            "Wire Gauge: Always use the correct wire gauge for the amperage of the circuit (e.g., 14-gauge for 15A, 12-gauge for 20A).",
            "Connections: All connections must be made inside an approved, accessible electrical box. Wires should be joined with wire nuts or other approved connectors.",
            "Securing Cable: Romex (NM-B) cable must be stapled to studs within 12 inches of a box and every 4.5 feet thereafter.",
            "Protection: Use nail plates to protect wires from being pierced by drywall screws or nails where they pass through studs.",
            "Box Fill: Do not over-stuff electrical boxes. Use the Box Fill Calculator to ensure you have adequate space."
        ],
        materials: ["Properly gauged wire (e.g., Romex NM-B)", "Wire staples", "Nail plates", "Electrical boxes", "Wire nuts"],
        proTips: [
            "Leave at least 6-8 inches of extra wire inside the box to make connections easier.",
            "When stripping wire, be careful not to nick the copper, which can create a weak spot."
        ],
        safetyNotes: "Exposed wiring, splices outside of boxes, and overloaded circuits are serious fire hazards. Always follow NEC guidelines."
    },
    "power-tools": {
        title: "Power Tool Handling",
        steps: [
            "Inspect Tools: Before each use, check the tool, cord, and plug for any damage. Do not use damaged tools.",
            "Use the Right Tool: Don't force a tool to do a job it wasn't designed for.",
            "Keep Guards in Place: Never remove safety guards from tools like saws or grinders.",
            "GFCI Protection: When working outdoors or in wet locations, plug your corded tools into a GFCI-protected outlet.",
            "Disconnect When Not in Use: Unplug tools when changing bits/blades or when you are finished."
        ],
        materials: ["The power tool itself", "Appropriate safety gear (PPE)"],
        proTips: [
            "Keep your work area clean and well-lit to prevent accidents.",
            "Use a heavy-gauge extension cord that is rated for the amperage of your tool to avoid voltage drop and overheating."
        ],
        safetyNotes: "Treat every tool as if it is loaded. Keep fingers away from triggers and moving parts. Be aware of your surroundings and other people."
    },
    "ppe": {
        title: "Personal Protective Equipment (PPE)",
        steps: [
            "Eye Protection: Always wear safety glasses or goggles when cutting, drilling, or doing any work that could create flying debris.",
            "Hand Protection: Wear insulated gloves when working with potentially live circuits. Use leather or cut-resistant gloves when handling sharp materials.",
            "Hearing Protection: Use earplugs or earmuffs when operating loud tools like circular saws or hammer drills for an extended period.",
            "Footwear: Wear sturdy, closed-toe shoes, preferably with a non-slip sole. Steel-toed boots are recommended for heavy work.",
            "Head Protection: A hard hat is necessary on construction sites or when working underneath others."
        ],
        materials: ["Safety glasses", "Insulated/work gloves", "Hearing protection", "Sturdy boots"],
        proTips: [
            "Your PPE is only effective if you wear it. Make it a habit.",
            "Keep your PPE clean and in good condition. Replace it if it becomes damaged."
        ],
        safetyNotes: "There is no substitute for safety. Turning off the power is the most important piece of 'PPE'. All other equipment is a secondary line of defense."
    }
};
