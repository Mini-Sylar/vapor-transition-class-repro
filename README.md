# Vapor `<Transition>` class-merge bug

## Vue version

3.6.0-rc.3 (also reproduces on 3.6.0-rc.2)

## Steps to reproduce

```sh
npm install --legacy-peer-deps
npm run dev
```

Open the printed local URL. Four boxes render, all wrapping the **exact
same** `class="external-class"` usage from their parent, all rendering a
component with an internal `class="box internal-box"` on its own root:

- (A) `ChildNoTransition.vue`, mounted via `createVaporApp`
- (B) `ChildWithTransition.vue` — identical to (A), root wrapped in
  `<Transition>` — mounted via `createVaporApp`
- (C) `VdomChildWithTransition.vue` — identical markup to (B) — mounted via
  plain `createApp` (regular VDOM)
- (D) `VdomChildNoTransition.vue` — identical to (A) — mounted via
  `createApp`

The only variable between (A)/(B) and between (C)/(D) is the presence of
`<Transition>`. The only variable between (B) and (C) is Vapor vs. VDOM.

## What is expected?

All four boxes keep their internal styling (green background/border) *and*
pick up `external-class`: `class="external-class box internal-box"`.

## What actually happens?

- (A) Vapor, no `<Transition>`: `class="external-class box internal-box"` — correct.
- (B) Vapor, `<Transition>`-wrapped: `class="external-class"` — **`box` and
  `internal-box` are both gone**, not merged, not partially applied. Silently
  overwritten.
- (C) VDOM, `<Transition>`-wrapped: `class="external-class box internal-box"` — correct.
- (D) VDOM, no `<Transition>`: `class="external-class box internal-box"` — correct.

(B) is the only failure. Same Vue version, same source shape, only the
render pipeline (Vapor vs. VDOM) differs.



## What was tried (all fail identically)

- Default (no `inheritAttrs`, implicit fallthrough)
- `inheritAttrs: false` + `useAttrs()` + `v-bind="attrs"` on the root,
  alongside an explicit `:class`
- `inheritAttrs: false` + explicit `:class="[internal, attrs.class]"` array
  binding, `class` excluded from any `v-bind` spread
- Isolating `attrs.class` into its own dedicated `computed()`

Removing `<Transition>` (same component, plain root, no wrapper) makes every
one of the above work correctly.

## Other attrs are unaffected

`data-foo`-style attributes pass through correctly in both cases — only
`class` is overwritten, since `class` is the only attribute the wrapped
component *also* computes and binds itself.
