# TeamsSection Component Usage Examples

The `TeamsSection` component provides a flexible way to display team members in a 3-column layout with customizable styling.

## Basic Usage

```vue
<TeamsSection
  id="our-team"
  :teamMembers="[
    {
      imageSrc: '/assets/mayya.png',
      name: 'Mayya Aprosina',
      position: 'CEO & Business Designer',
    },
    {
      imageSrc: '/assets/miguel.png',
      name: 'Miguel Aprossine',
      position: 'AI & Web3 Visionary Partner',
    },
    {
      imageSrc: '/assets/marco.png',
      name: 'Marco Maffei',
      position: 'Full-Stack Engineer',
    },
  ]"
/>
```

## Advanced Usage with Custom Styling

```vue
<TeamsSection
  id="leadership-team"
  backgroundColor="bg-[#DDDDDD]"
  nameTextColor="text-[#161616]"
  positionTextColor="text-[#636363]"
  ovalWidth="w-40"
  ovalHeight="h-40"
  :teamMembers="[
    {
      imageSrc: '/assets/mayya.png',
      imageAlt: 'Mayya Aprosina - CEO',
      name: 'Mayya Aprosina',
      nameTag: 'h2',
      nameClass:
        'font-extrabold hover:text-[#8CB0FF] transition-colors duration-300',
      position: 'CEO & Business Designer',
    },
    {
      imageSrc: '/assets/miguel.png',
      imageAlt: 'Miguel Aprossine - Partner',
      name: 'Miguel Aprossine',
      nameTag: 'h2',
      nameClass:
        'font-extrabold hover:text-[#A620FF] transition-colors duration-300',
      position: 'AI & Web3 Visionary Partner',
    },
    {
      imageSrc: '/assets/marco.png',
      imageAlt: 'Marco Maffei - Engineer',
      name: 'Marco Maffei',
      nameTag: 'h2',
      nameClass:
        'font-extrabold hover:text-[#8CB0FF] transition-colors duration-300',
      position: 'Full-Stack Engineer',
    },
  ]"
/>
```

## Two-Column Layout Example

```vue
<TeamsSection
  id="founders"
  :columnCount="2"
  backgroundColor="bg-[#161616]"
  :teamMembers="[
    {
      imageSrc: '/assets/mayya.png',
      name: 'Mayya Aprosina',
      nameTag: 'h1',
      nameClass: 'text-gradient',
      position: 'Co-Founder & CEO',
    },
    {
      imageSrc: '/assets/miguel.png',
      name: 'Miguel Aprossine',
      nameTag: 'h1',
      nameClass: 'text-gradient',
      position: 'Co-Founder & CTO',
    },
  ]"
/>
```

## With Background Image

```vue
<TeamsSection
  id="team-with-bg"
  backgroundImage="/assets/team-background.jpg"
  nameTextColor="text-white"
  positionTextColor="text-gray-200"
  :teamMembers="[
    // ... team members
  ]"
/>
```

## Component Props Reference

### Required Props

- `teamMembers` (Array): Array of team member objects

### Team Member Object Structure

```javascript
{
  imageSrc: String,       // Required - Path to team member image
  imageAlt: String,       // Optional - Alt text for image (defaults to name)
  imageClass: String,     // Optional - Custom classes for image
  name: String,           // Required - Team member name
  nameTag: String,        // Optional - HTML tag for name (h1-h6, p) - defaults to h3
  nameClass: String,      // Optional - Custom classes for name
  position: String        // Required - Team member position/title
}
```

### Optional Props

- `id` (String): Section ID
- `columnCount` (Number): Number of columns (default: 3)
- `backgroundColor` (String): Background color class (default: 'bg-[#161616]')
- `nameTextColor` (String): Text color for names (default: 'text-white')
- `positionTextColor` (String): Text color for positions (default: 'text-[#999999]')
- `backgroundImage` (String): Background image URL
- `ovalWidth` (String): Width class for image container (default: 'w-32')
- `ovalHeight` (String): Height class for image container (default: 'h-32')

## Features

1. **Responsive Design**: Automatically adjusts from 1 column on mobile to 2 on tablet to 3 on desktop
2. **Oval Image Containers**: Images are automatically cropped to oval shapes with hover effects
3. **Dynamic Name Tags**: Names can use any HTML tag (h1-h6, p) with custom styling
4. **Flexible Styling**: All text colors, background, and spacing can be customized
5. **Accessibility**: Proper alt texts and semantic HTML structure

## CSS Classes Available

The component includes pre-defined oval size classes:

- `.oval-sm` (80px × 80px)
- `.oval-md` (120px × 120px)
- `.oval-lg` (160px × 160px)
- `.oval-xl` (200px × 200px)

You can also use any Tailwind width/height classes for custom sizes.
