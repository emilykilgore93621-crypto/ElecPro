
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
            "Ensure the electrical box is fan-rated. If not, replace it.",
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
    }
};
