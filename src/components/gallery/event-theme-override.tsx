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

const HEX_COLOR_RE = /^#[0-9a-fA-F]{6}$/;

function safeColor(value: string | null | undefined): string | null {
  return value && HEX_COLOR_RE.test(value) ? value : null;
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

  // Sanitize every color up front — nothing below this line should
  // ever touch the raw, unvalidated theme* values again.
  const primaryColor = safeColor(themePrimaryColor);
  const secondaryColor = safeColor(themeSecondaryColor);
  const accentColor = safeColor(themeAccentColor);
  const backgroundColor = safeColor(themeBackgroundColor);
  const borderColor = safeColor(themeBorderColor);
  const buttonColor = safeColor(themeButtonColor);

  // Check if at least one override color exists
  const hasOverride =
    primaryColor ||
    secondaryColor ||
    accentColor ||
    backgroundColor ||
    borderColor ||
    buttonColor;

  if (!hasOverride) return null;

  // Build the dynamic CSS variables override styles
  // We apply the overrides to both :root and .dark (or handle them dynamically)
  const css = `
    :root, .dark, [data-theme] {
      ${primaryColor ? `
        --cherry: ${primaryColor} !important;
        --color-cherry: ${primaryColor} !important;
        --ring: ${primaryColor} !important;
      ` : ''}
      ${secondaryColor ? `
        --secondary: ${secondaryColor} !important;
        --secondary-foreground: ${primaryColor || '#480c18'} !important;
      ` : ''}
      ${accentColor ? `
        --candy: ${accentColor} !important;
        --color-candy: ${accentColor} !important;
      ` : ''}
      ${backgroundColor ? `
        --background: ${backgroundColor} !important;
      ` : ''}
      ${borderColor ? `
        --border: ${borderColor} !important;
        --input: ${borderColor} !important;
        --warm-ivory: ${borderColor} !important;
      ` : ''}
      ${buttonColor ? `
        --button-bg: ${buttonColor} !important;
      ` : ''}
    }

    /* Override utility classes directly to guarantee theme fidelity */
    ${primaryColor ? `
      .bg-cherry, .bg-velvet-red, .bg-primary { background-color: ${primaryColor} !important; }
      .text-cherry, .text-velvet-red, .text-primary { color: ${primaryColor} !important; }
      .border-cherry, .border-velvet-red, .border-primary { border-color: ${primaryColor} !important; }
      .hover\\:bg-cherry:hover, .hover\\:bg-velvet-red:hover { background-color: ${primaryColor} !important; }
      .hover\\:text-cherry:hover, .hover\\:text-velvet-red:hover { color: ${primaryColor} !important; }
    ` : ''}

    ${buttonColor ? `
      .bg-cherry, .bg-velvet-red { background-color: ${buttonColor} !important; }
      .hover\\:bg-cherry:hover, .hover\\:bg-velvet-red:hover { background-color: ${buttonColor} !important; }
    ` : ''}

    ${backgroundColor ? `
      body, .bg-background { background-color: ${backgroundColor} !important; }
    ` : ''}

    ${borderColor ? `
      .border-border, .border-border, .border-input { border-color: ${borderColor} !important; }
    ` : ''}
  `;

  return (
    <style
      id={`event-theme-${primaryColor || 'custom'}`}
      dangerouslySetInnerHTML={{ __html: css }}
    />
  );
}