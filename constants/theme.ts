export const lightTheme = {
  background: '#FAFAFA',
  cardBackground: '#FAFAFA',
  inputBackground: '#F8F8F8',
  text: '#494C6B',
  textSecondary: '#D1D2DA',
  border: '#E0E0E0',
  primary: '#3A7CFD',
  completed: '#9495A5',
  completedText: '#9495A5',
  shadow: 'rgba(0, 0, 0, 0.1)',
  icon: '#757575',
  deleteButton: '#FF6B6B',
  filterButton: '#9495A5',
};

export const darkTheme = {
  background: '#171823',
  cardBackground: '#25273D',
  inputBackground: '#25273D',
  text: '#C8CBE7',
  textSecondary: '#4D5067',
  border: '#2A2A4E',
  primary: '#3A7CFD',
  completed: '#4D5067',
  completedText: '#4D5067',
  shadow: 'rgba(0, 0, 0, 0.3)',
  icon: '#B0B0B0',
  deleteButton: '#FF6B6B',
  filterButton: '#5B5E7E',
};

export type Theme = typeof lightTheme;