// The life of a How2 prompt: the beats, in order. One beat is one press.
// This is the only file to edit to change the talk's words or order.
//
// A beat:
//   id        short unique name, shown in the overview (O)
//   set       what changes on this press. Only what changes; everything else carries over.
//               scene     title | phone | clutter | void | composer | preview | immersive | condensed | controls | end
//               composer  hidden | standby | idle | listening | prompt | confirmed
//               text      what has been asked so far, after "How to" (typed in when it grows)
//               phone     on | late          (act 1: the video on the phone)
//               checks    one word per ingredient: ok | miss | -   (bread eggs cinnamon pan skillet)
//               look      which part to point at: ingredients | sources | step | ''  (preview)
//               media     none | basic | full | minimal
//               focus     which media button to point at: steps | tutorials | viewer | ingredients | sources | ''
//   thoughts  the words on this press: [{ text, at, size }]
//               at    top | bottom | left | right | center
//               size  'title' or 'small' (optional)
//               **words** are set in the accent colour. A thought that is on the next press too,
//               with the same words and place, stays put instead of appearing again.
//
// Facts come from the How2To case study (9 interviews, 7/9, 6/9, 5/9, 3 to 4 apps, B2B, 4 months).
// The recipe text on the step card is demo content.

var BEATS = [
  // Title
  { id: 'title', set: { scene: 'title' }, thoughts: [
    { text: 'The life of a **How2** prompt', at: 'center', size: 'title' },
    { text: 'How2To · spatial tutorials for Vision Pro · Omnia', at: 'center', size: 'small' }] },

  // Act 1: the problem
  { id: 'phone', set: { scene: 'phone', phone: 'on' }, thoughts: [
    { text: 'You’re making french toast.', at: 'right' }] },
  { id: 'egg', thoughts: [
    { text: 'You’re making french toast.', at: 'right' },
    { text: 'Your hands are covered in egg.', at: 'right' }] },
  { id: 'late', set: { phone: 'late' }, thoughts: [
    { text: 'The video doesn’t wait for you.', at: 'right' }] },
  { id: 'seven', thoughts: [
    { text: 'The video doesn’t wait for you.', at: 'right' },
    { text: '**7 of 9** people I interviewed struggled to pause, or to switch between the video and the task.', at: 'right', size: 'small' }] },
  { id: 'clutter', set: { scene: 'clutter' }, thoughts: [
    { text: 'Instructions live in one place. The work happens in another.', at: 'bottom' }] },
  { id: 'five', thoughts: [
    { text: 'Instructions live in one place. The work happens in another.', at: 'bottom' },
    { text: '**5 of 9** found AR tools either non-intuitive or overly complex.', at: 'bottom', size: 'small' }] },
  { id: 'hmw', set: { scene: 'void', phone: 'on' }, thoughts: [
    { text: 'How might we put the tutorial in the room,', at: 'center' },
    { text: 'without adding to the load?', at: 'center' }] },

  // Act 2: the composer is born
  { id: 'standby', set: { scene: 'composer', composer: 'standby' }, thoughts: [
    { text: 'Start with almost nothing.', at: 'bottom' }] },
  { id: 'presence', thoughts: [
    { text: 'Start with almost nothing.', at: 'bottom' },
    { text: 'Just a presence in the room, waiting.', at: 'bottom', size: 'small' }] },
  { id: 'idle', set: { composer: 'idle' }, thoughts: [
    { text: 'Every tutorial starts with the same two words.', at: 'bottom' }] },
  { id: 'say-them', thoughts: [
    { text: 'Every tutorial starts with the same two words.', at: 'bottom' },
    { text: 'So the box says them for you.', at: 'bottom', size: 'small' }] },

  // Act 3: voice first
  { id: 'six', set: { composer: 'listening' }, thoughts: [
    { text: '**6 of 9** wanted hands-free instructions.', at: 'top' }] },
  { id: 'voice', thoughts: [
    { text: '**6 of 9** wanted hands-free instructions.', at: 'top' },
    { text: 'So voice comes first.', at: 'bottom' }] },
  { id: 'glow', thoughts: [
    { text: 'The glow says “I’m hearing you”, with no words needed.', at: 'bottom' }] },
  { id: 'prompt', set: { composer: 'prompt', text: 'make french toast?' }, thoughts: [
    { text: 'You only say the part that’s yours.', at: 'bottom' }] },
  { id: 'confirmed', set: { composer: 'confirmed' }, thoughts: [
    { text: 'Heard. Then it steps back, out of your way.', at: 'bottom' }] },

  // Act 4: the prompt unfolds
  { id: 'preview', set: { scene: 'preview', composer: 'standby', checks: '- - - - -' }, thoughts: [
    { text: 'The prompt becomes a tutorial: steps, ingredients and sources.', at: 'bottom' }] },
  { id: 'have-all', set: { look: 'ingredients' }, thoughts: [
    { text: 'Before you start: do you have everything?', at: 'bottom' }] },
  { id: 'scan', set: { checks: 'ok ok ok - -' }, thoughts: [
    { text: 'Scan the counter. Tick off what’s there.', at: 'bottom' }] },
  { id: 'missing', set: { checks: 'ok ok ok ok miss' }, thoughts: [
    { text: 'Missing something? Better to know now than halfway through.', at: 'bottom' }] },
  { id: 'sources', set: { look: 'sources' }, thoughts: [
    { text: 'And you can see where every step comes from.', at: 'bottom' }] },
  { id: 'not-happy', set: { look: '' }, thoughts: [
    { text: 'Not happy? Browse, see more, or ask again by voice.', at: 'bottom' }] },

  // Act 4b: the viewers
  { id: 'immersive', set: { scene: 'immersive', media: 'full' }, thoughts: [] },
  { id: 'one-step', thoughts: [
    { text: 'One step, big, in the room.', at: 'left' }] },
  { id: 'condensed', set: { scene: 'condensed' }, thoughts: [
    { text: 'People used to spatial interfaces run **3 or 4 apps** at once.', at: 'bottom' }] },
  { id: 'b2b', thoughts: [
    { text: 'People used to spatial interfaces run **3 or 4 apps** at once.', at: 'bottom' },
    { text: 'At work, getting it done beats immersion. So there’s a condensed view.', at: 'bottom', size: 'small' }] },

  // Act 5: the controls
  { id: 'basic', set: { scene: 'controls', media: 'basic' }, thoughts: [
    { text: 'A standard player knows play, pause and skip.', at: 'bottom' }] },
  { id: 'no-steps', thoughts: [
    { text: 'A standard player knows play, pause and skip.', at: 'bottom' },
    { text: 'It doesn’t know about steps.', at: 'bottom', size: 'small' }] },
  { id: 'redesign', set: { media: 'full' }, thoughts: [
    { text: 'So I redesigned it.', at: 'bottom' }] },
  { id: 'f-steps', set: { focus: 'steps' }, thoughts: [
    { text: '**Steps**: where you are, and what’s next.', at: 'bottom' }] },
  { id: 'f-tutorials', set: { focus: 'tutorials' }, thoughts: [
    { text: '**Tutorials**: jump to another one.', at: 'bottom' }] },
  { id: 'f-viewer', set: { focus: 'viewer' }, thoughts: [
    { text: '**Viewer**: immersive or condensed.', at: 'bottom' }] },
  { id: 'f-ingredients', set: { focus: 'ingredients' }, thoughts: [
    { text: '**Ingredients**: show or hide them.', at: 'bottom' }] },
  { id: 'f-sources', set: { focus: 'sources' }, thoughts: [
    { text: '**Sources**: where each step came from.', at: 'bottom' }] },
  { id: 'footprint', set: { focus: '' }, thoughts: [
    { text: 'All of it, in a small footprint.', at: 'bottom' }] },
  { id: 'minimal', set: { media: 'minimal' }, thoughts: [
    { text: 'And smaller still, when play and pause are all you need.', at: 'bottom' }] },

  // End
  { id: 'waits', set: { scene: 'end', media: 'none', composer: 'standby' }, thoughts: [
    { text: 'And then it waits again.', at: 'right' }] },
  { id: 'credits', set: { scene: 'credits', composer: 'hidden' }, thoughts: [
    { text: '**How2To**', at: 'center', size: 'title' },
    { text: 'UI design and UX research at Omnia · 4 months', at: 'center', size: 'small' },
    { text: 'Vision Pro · Meta Quest · iOS', at: 'center', size: 'small' }] }
];
