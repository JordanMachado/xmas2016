const world = {
  lightSide: {
    objects: [
      {
        type: 'three',
        reactive: true,
        ao: false,
        shininess: 3000,
        p: {
          x: -40,
          y: 24,
          z: 10,
        },
        scale: 0.08,
      },
      {
        type: 'present',
        reactive: true,
        ao: false,
        shininess: 3000,
        p: {
          x: -31,
          y: 10,
          z: 10,
        },
        scale: 0.08,
      },
      {
        type: 'present',
        reactive: true,
        ao: false,
        shininess: 3000,
        p: {
          x: -40,
          y: 10,
          z: -3,
        },
        scale: 0.09,
      },
      {
        type: 'present',
        reactive: true,
        ao: false,
        shininess: 3000,
        p: {
          x: -53,
          y: 10,
          z: -3,
        },
        r: {
          x: 0,
          y: 50,
          z: 0,
        },
        scale: 0.12,
      },
      {
        type: 'candy',
        reactive: true,
        ao: false,
        shininess: 3000,
        p: {
          x: -17,
          y: 15,
          z: -58,
        },
        r: {
          x: 0,
          y: 50,
          z: 0,
        },
        scale: 10,
      },
    ],
  },
};
export default world;
