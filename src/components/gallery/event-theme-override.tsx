'use client';

import React from 'react';

interface EventThemeOverrideProps {
  event: {
    themePrimaryColor?: string | null;
    themeSecondaryColor?: string | null;
    themeAccentColor?: string | null;
    themeBackgroundColor?: string | null;
    themeBorderColor?: string | null;
    themeButtonColor?: string | null;
  };
}

export function EventThemeOverride({ event }: EventThemeOverrideProps) {
  if (!event) return null;

  const {
    themePrimaryColor,
    themeSecondaryColor,
    themeAccentColor,
    themeBackgroundColor,
    themeBorderColor,
    themeButtonColor,
  } = event;

  // Check if at least one override color exists
  const hasOverride =
    themePrimaryColor ||
    themeSecondaryColor ||
    themeAccentColor ||
    themeBackgroundColor ||
    themeBorderColor ||
    themeButtonColor;

  if (!hasOverride) return null;

  // Build the dynamic CSS variables override styles
  // We apply the overrides to both :root and .dark (or handle them dynamically)
  const css = `
    :root, .dark, [data-theme] {
      ${themePrimaryColor ? `
        --cherry: ${themePrimaryColor} !important;
        --color-cherry: ${themePrimaryColor} !important;
        --ring: ${themePrimaryColor} !important;
      ` : ''}
      ${themeSecondaryColor ? `
        --secondary: ${themeSecondaryColor} !important;
        --secondary-foreground: ${themePrimaryColor || '#5A0F0F'} !important;
      ` : ''}
      ${themeAccentColor ? `
        --candy: ${themeAccentColor} !important;
        --color-candy: ${themeAccentColor} !important;
      ` : ''}
      ${themeBackgroundColor ? `
        --background: ${themeBackgroundColor} !important;
      ` : ''}
      ${themeBorderColor ? `
        --border: ${themeBorderColor} !important;
        --input: ${themeBorderColor} !important;
        --warm-ivory: ${themeBorderColor} !important;
      ` : ''}
      ${themeButtonColor ? `
        --button-bg: ${themeButtonColor} !important;
      ` : ''}
    }

    /* Override utility classes directly to guarantee theme fidelity */
    ${themePrimaryColor ? `
      .bg-cherry, .bg-velvet-red, .bg-primary { background-color: ${themePrimaryColor} !important; }
      .text-cherry, .text-velvet-red, .text-primary { color: ${themePrimaryColor} !important; }
      .border-cherry, .border-velvet-red, .border-primary { border-color: ${themePrimaryColor} !important; }
      .hover\\:bg-cherry:hover, .hover\\:bg-velvet-red:hover { background-color: ${themePrimaryColor} !important; }
      .hover\\:text-cherry:hover, .hover\\:text-velvet-red:hover { color: ${themePrimaryColor} !important; }
    ` : ''}

    ${themeButtonColor ? `
      .bg-cherry, .bg-velvet-red { background-color: ${themeButtonColor} !important; }
      .hover\\:bg-cherry:hover, .hover\\:bg-velvet-red:hover { background-color: ${themeButtonColor} !important; }
    ` : ''}

    ${themeBackgroundColor ? `
      body, .bg-background { background-color: ${themeBackgroundColor} !important; }
    ` : ''}

    ${themeBorderColor ? `
      .border-border, .border-border, .border-input { border-color: ${themeBorderColor} !important; }
    ` : ''}
  `;

  return (
    <style
      id={`event-theme-${themePrimaryColor || 'custom'}`}
      dangerouslySetInnerHTML={{ __html: css }}
    />
  );
}
