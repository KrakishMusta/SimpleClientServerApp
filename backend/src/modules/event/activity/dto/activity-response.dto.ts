export interface ActivityResponseDto {
  id: string;
  title: string;
  dayIndex: number;
  start: string; // HH:mm
  date: Date;
  jury: string[];
}
