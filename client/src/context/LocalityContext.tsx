import React, { createContext, useContext, useState, useEffect } from 'react';

export interface IndoreLocality {
  id: string;
  name: string;
  hindiName: string;
  landmark: string;
  lat: number;
  lng: number;
}

export const INDORE_LOCALITIES: IndoreLocality[] = [
  {
    id: 'ALL',
    name: 'All Indore',
    hindiName: 'सम्पूर्ण इंदौर',
    landmark: 'Citywide Mesh Network',
    lat: 22.7196,
    lng: 75.8577,
  },
  {
    id: 'Bhawarkua',
    name: 'Bhawarkua',
    hindiName: 'भंवरकुआं (छात्र केंद्र)',
    landmark: 'Bhawarkua Square • Coaching & Hostels',
    lat: 22.6926,
    lng: 75.8676,
  },
  {
    id: 'Geeta Bhawan',
    name: 'Geeta Bhawan / SGSITS',
    hindiName: 'गीता भवन व एसजीएसआईटीएस',
    landmark: 'SGSITS Campus & Geeta Bhawan Sq.',
    lat: 22.7244,
    lng: 75.8752,
  },
  {
    id: 'Palasia',
    name: 'Palasia (Old & New)',
    hindiName: 'पलासिया (ओल्ड व न्यू)',
    landmark: '56 Dukan, Industry House, Palasia',
    lat: 22.7241,
    lng: 75.8839,
  },
  {
    id: 'Vijay Nagar',
    name: 'Vijay Nagar',
    hindiName: 'विजय नगर (स्कीम 54/78)',
    landmark: 'Vijay Nagar Square, Brilliant Conv.',
    lat: 22.7533,
    lng: 75.8937,
  },
  {
    id: 'Sudama Nagar',
    name: 'Sudama Nagar / Annapurna',
    hindiName: 'सुदामा नगर व अन्नपूर्णा',
    landmark: 'Annapurna Mandir, Phooti Kothi',
    lat: 22.6908,
    lng: 75.8344,
  },
  {
    id: 'Rajwada',
    name: 'Rajwada / Sarafa',
    hindiName: 'राजवाड़ा व सराफा',
    landmark: 'Rajwada Palace & Historic Central',
    lat: 22.7186,
    lng: 75.8554,
  },
];

interface LocalityContextType {
  selectedLocality: string;
  setSelectedLocality: (locId: string) => void;
  radiusKm: number;
  setRadiusKm: (radius: number) => void;
  currentLocalityInfo: IndoreLocality;
  getDistanceLabel: (targetLocationText: string) => string;
  isWithinRadius: (targetLocationText: string) => boolean;
}

const LocalityContext = createContext<LocalityContextType | undefined>(undefined);

export const LocalityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedLocality, setSelectedLocalityState] = useState<string>(() => {
    return localStorage.getItem('openhand_selected_locality') || 'ALL';
  });

  const [radiusKm, setRadiusKmState] = useState<number>(() => {
    const saved = localStorage.getItem('openhand_radius_km');
    return saved ? Number(saved) : 5;
  });

  const setSelectedLocality = (locId: string) => {
    setSelectedLocalityState(locId);
    localStorage.setItem('openhand_selected_locality', locId);
  };

  const setRadiusKm = (r: number) => {
    setRadiusKmState(r);
    localStorage.setItem('openhand_radius_km', String(r));
  };

  const currentLocalityInfo =
    INDORE_LOCALITIES.find((l) => l.id === selectedLocality) || INDORE_LOCALITIES[0];

  // Helper to approximate distance based on location string matching
  const getDistanceLabel = (targetLocationText: string): string => {
    if (selectedLocality === 'ALL') {
      return '~0.8 - 2.5 km';
    }

    const lower = targetLocationText.toLowerCase();
    const activeLower = selectedLocality.toLowerCase();

    if (lower.includes(activeLower)) {
      return '0.3 - 0.7 km away';
    }

    // Nearby adjacency rules for Indore
    if (
      (activeLower.includes('geeta') && lower.includes('palasia')) ||
      (activeLower.includes('palasia') && lower.includes('geeta'))
    ) {
      return '1.2 km away';
    }

    if (
      (activeLower.includes('bhawarkua') && lower.includes('sudama')) ||
      (activeLower.includes('sudama') && lower.includes('bhawarkua'))
    ) {
      return '1.8 km away';
    }

    if (activeLower.includes('vijay') && (lower.includes('bhawarkua') || lower.includes('sudama'))) {
      return '6.5 km away';
    }

    return '2.1 km away';
  };

  const isWithinRadius = (targetLocationText: string): boolean => {
    if (selectedLocality === 'ALL' || radiusKm >= 15) return true;

    const lower = targetLocationText.toLowerCase();
    const activeLower = selectedLocality.toLowerCase();

    // Exact locality match is always in radius
    if (lower.includes(activeLower)) return true;

    // Radius checks
    if (radiusKm <= 1) {
      return lower.includes(activeLower);
    }

    if (radiusKm <= 3) {
      if (
        (activeLower.includes('geeta') && lower.includes('palasia')) ||
        (activeLower.includes('palasia') && lower.includes('geeta')) ||
        (activeLower.includes('bhawarkua') && lower.includes('sgsits'))
      ) {
        return true;
      }
      return lower.includes(activeLower);
    }

    // 5 km includes most inter-ward adjacent trips in Indore
    return true;
  };

  return (
    <LocalityContext.Provider
      value={{
        selectedLocality,
        setSelectedLocality,
        radiusKm,
        setRadiusKm,
        currentLocalityInfo,
        getDistanceLabel,
        isWithinRadius,
      }}
    >
      {children}
    </LocalityContext.Provider>
  );
};

export const useLocality = () => {
  const context = useContext(LocalityContext);
  if (!context) {
    throw new Error('useLocality must be used within a LocalityProvider');
  }
  return context;
};
