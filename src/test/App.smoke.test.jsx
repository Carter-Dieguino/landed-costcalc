import { describe, it, expect } from 'vitest';
import { render, screen, within, act } from '@testing-library/react';
import App from '../App.jsx';

describe('<App /> smoke', () => {
  it('mounts without crashing and renders the brand', () => {
    render(<App />);
    expect(screen.getByText('COST')).toBeInTheDocument();
    expect(screen.getByText('CALC')).toBeInTheDocument();
  });

  it('shows the three mode chips', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /freelancer/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^proyecto$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /organización/i })).toBeInTheDocument();
  });

  it('shows tabs visible in project mode', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /capital humano/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /comisiones/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /resumen/i })).toBeInTheDocument();
  });

  it('renders the cost display in the header', () => {
    render(<App />);
    // El header tiene la etiqueta COSTO MENSUAL en project mode
    expect(screen.getByText(/COSTO MENSUAL/i)).toBeInTheDocument();
  });

  it('renders carga social section in human tab by default', async () => {
    render(<App />);
    // El tab "human" es el default; busca el desglose
    expect(screen.getByText(/Carga social y región/i)).toBeInTheDocument();
  });

  it('hides Comisiones tab when switching to Freelancer mode', async () => {
    render(<App />);
    const freelancerChip = screen.getByRole('button', { name: /freelancer/i });
    await act(async () => freelancerChip.click());
    // Comisiones ya no debe estar en la barra de tabs
    const tabs = screen.queryAllByRole('button', { name: /comisiones/i });
    expect(tabs).toHaveLength(0);
  });
});
