import axios from 'axios';
import { format, addDays } from 'date-fns';

export const fetchAsteroidData = async () => {
  try {
    const API_KEY = process.env.REACT_APP_NASA_API_KEY;
   
    const start_date = format(new Date(), 'yyyy-MM-dd');
    const end_date = format(addDays(new Date(start_date), 7), 'yyyy-MM-dd');

    const response = await axios.get(
      `https://api.nasa.gov/neo/rest/v1/feed?start_date=${start_date}&end_date=${end_date}&api_key=${API_KEY}`
    );

    const nearEarthObjects = response.data.near_earth_objects;
    let asteroids = [];

    // Collect asteroids from all dates in the range
    Object.values(nearEarthObjects).forEach(dailyAsteroids => {
      asteroids = asteroids.concat(dailyAsteroids);
    });

    // Sort asteroids by close approach date
    asteroids.sort((a, b) => 
      new Date(a.close_approach_data[0].close_approach_date) - 
      new Date(b.close_approach_data[0].close_approach_date)
    );


    const getRandomColor = () => {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    };

    const processedAsteroids = asteroids.map(asteroid => {
      const velocityKms = parseFloat(asteroid.close_approach_data[0]?.relative_velocity?.kilometers_per_second || 0);
   
      return {
        id: asteroid.id,
        name: asteroid.name,
        velocity: velocityKms,  // Adjusted velocity
        distance: parseFloat(asteroid.close_approach_data[0]?.miss_distance?.kilometers || 0).toFixed(0),
        estimatedDiameter: {
          min: asteroid.estimated_diameter.kilometers.estimated_diameter_min,
          max: asteroid.estimated_diameter.kilometers.estimated_diameter_max,
        },
        isPotentiallyHazardous: asteroid.is_potentially_hazardous_asteroid,
        orbitingBodyName: asteroid.close_approach_data[0]?.orbiting_body,
        closeApproachDate: asteroid.close_approach_data[0]?.close_approach_date,
        orbitData: {
          semiMajorAxis: asteroid.orbital_data?.semi_major_axis,
          eccentricity: asteroid.orbital_data?.eccentricity,
        },
        color: getRandomColor() // Assign a random color to each asteroid
      };
    });

    return processedAsteroids;
  } catch (error) {
    console.error('Error fetching asteroid data:', error);
    throw error;
  }
};
