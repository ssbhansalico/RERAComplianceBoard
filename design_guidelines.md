# Design Guidelines: Gujarat RERA Information Board Generator

## Design Approach
**System-Based: Material Design** - Optimal for form-heavy, data-driven government compliance applications requiring clarity, structure, and accessibility.

## Typography System

**Primary Font**: Noto Sans (supports both English and Gujarati scripts seamlessly)
**Secondary Font**: Roboto (for UI elements, buttons, labels)

**Hierarchy**:
- Page Title: 2xl, semibold
- Section Headers: xl, medium  
- Form Labels (Bilingual): base, medium (English) / base, medium (Gujarati)
- Input Text: base, regular
- Help Text: sm, regular
- Preview Board Text: Scales to match actual print dimensions

## Layout System

**Spacing Units**: Tailwind classes of 3, 4, 6, 8, 12, 16, 24
- Form field spacing: space-y-6
- Section padding: p-8
- Card padding: p-6
- Input padding: p-3
- Button padding: px-6 py-3

**Grid Structure**: Two-column desktop layout
- Left Column (60%): Form input area with max-w-3xl
- Right Column (40%): Live preview panel, sticky positioning

**Mobile**: Single column stack, preview below form

## Component Library

### Form Components

**Input Fields**:
- Full-width text inputs with bilingual labels stacked (English above, Gujarati below in smaller text)
- Border: 1px solid, rounded corners (rounded-md)
- Focus state: 2px border width
- Error state: Border changes, helper text appears below

**Bilingual Label Pattern**:
```
English Label (medium weight, base size)
ગુજરાતી લેબલ (regular weight, sm size, muted)
```

**Select Dropdowns**: 
- Same styling as text inputs
- Chevron icon on right
- Options: Project Type, Background Color selection

**Dynamic Table (Block Details)**:
- Bordered table with header row
- Bilingual column headers
- Add/Remove row buttons at bottom
- 4 columns: Block Number, Shops, Offices, Residential
- Zebra striping for readability
- Input fields within table cells

**Textarea Fields**:
- Min height 4 rows for specifications/amenities
- Auto-expanding
- Character count indicator if needed

**File Upload (QR Code)**:
- Drag-and-drop zone with dashed border
- Image preview thumbnail after upload
- File size/type validation message
- "Replace" button when image exists

**Toggle Switch**:
- Background color selection: Yellow/White
- Large, clear switch with labels on both sides

**Loan Conditional Logic**:
- Radio buttons: Yes/No for loan existence
- Conditional fields appear/hide based on selection
- "Not Applicable" auto-filled when No selected

### Navigation & Actions

**Primary Action Button**: 
- "Generate Board" / "બોર્ડ જનરેટ કરો" 
- Large, prominent, full-width on mobile
- Fixed to bottom on mobile, inline on desktop

**Secondary Actions**:
- Download PDF button
- Download PNG button  
- Reset Form button (with confirmation)

**Progress Indicator**:
- Step counter: "Section 1 of 4" to guide users through long form
- Completion percentage bar at top

### Preview Panel

**Live Preview Container**:
- Sticky positioning on desktop (top-24)
- White card with shadow
- Exact aspect ratio of final board (1.20m x 2.00m = 3:5 ratio)
- Zoom controls for detail inspection
- Background toggles between yellow/white as selected

**Preview Content**:
- Scaled-down replica of final board
- Real-time updates as form is filled
- RED text rendered in actual red color (#DC2626 or similar)
- Gujarati typography properly rendered
- QR code displayed at correct relative size
- Grid lines overlay (toggle-able) to show alignment

### Status & Feedback

**Validation Messages**:
- Inline below fields for errors
- Success checkmarks appear when section complete
- Summary of missing fields at top when attempting to generate

**Loading States**:
- Skeleton screens for preview rendering
- Spinner for PDF/PNG generation
- Toast notifications for successful downloads

**Empty States**:
- Preview shows template outline when form is empty
- Helpful prompt: "Fill the form to see preview"

## Animations

**Minimal, Purposeful Only**:
- Form field focus: Subtle border width transition (150ms)
- Section expand/collapse: Height transition (200ms)
- File upload: Drag-over state highlight
- NO scroll animations, NO page transitions

## Accessibility

**Form Accessibility**:
- Proper label/input associations
- Keyboard navigation throughout
- ARIA labels for bilingual content
- Required field indicators (*)
- Clear error announcements

**Bilingual Support**:
- Proper lang attributes for Gujarati sections
- Font size minimum 14px for readability in both scripts
- High contrast ratios for all text

## Responsive Breakpoints

- Mobile: < 768px - Single column, stacked form
- Tablet: 768px - 1024px - Adjusted two-column
- Desktop: > 1024px - Full two-column with sticky preview

## Images

**No hero images needed** - This is a form utility tool. Only user-uploaded QR code image is required.

## Page Structure

**Header Section**:
- Application title (bilingual)
- Brief instruction text
- RERA logo/branding if available

**Form Sections** (Collapsible accordions):
1. Basic Project Information
2. Block Details (with dynamic table)
3. Project Specifications
4. Financial Information
5. Loan Information (conditional)

**Footer Section**:
- Download action buttons
- Help/FAQ link
- Contact information for support

This design prioritizes **clarity, accuracy, and efficiency** - essential for government compliance documentation where errors have legal consequences.