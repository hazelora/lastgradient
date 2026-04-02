export type GradientType = 'rainbow' | 'red' | 'blue' | 'green' | 'pink' | 'sunset' | 'ocean';

export interface GradientOption {
  id: GradientType;
  label: string;
  colors: string[]; // For preview
}

export const GRADIENTS: GradientOption[] = [
  { id: 'rainbow', label: 'Rainbow', colors: ['#FF0000', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#FF00FF'] },
  { id: 'red', label: 'Crimson Pulse', colors: ['#880000', '#FF0000', '#FF8888', '#FF0000', '#880000'] },
  { id: 'blue', label: 'Deep Ocean', colors: ['#000088', '#0000FF', '#8888FF', '#0000FF', '#000088'] },
  { id: 'green', label: 'Forest Life', colors: ['#004400', '#00FF00', '#88FF88', '#00FF00', '#004400'] },
  { id: 'pink', label: 'Bubblegum', colors: ['#880044', '#FF0088', '#FF88CC', '#FF0088', '#880044'] },
  { id: 'sunset', label: 'Sunset Glow', colors: ['#FF4E50', '#FC913A', '#F9D423'] },
  { id: 'ocean', label: 'Tropical Sea', colors: ['#2E3192', '#1BFFFF'] },
];
