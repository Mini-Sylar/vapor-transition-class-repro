# Vapor `<Transition>` class-merge bug

## Vue version

3.6.0-rc.3 (also reproduces on 3.6.0-rc.2)

## Steps to reproduce

```sh
npm install --legacy-peer-deps
npm run dev
```

Open the printed local URL. Two boxes render, both wrapping the **exact same**
`class="external-class"` usage from `App.vue`, both rendering a component
with an internal `class="box internal-box"` on its own root. The only
difference between `ChildNoTransition.vue` and `ChildWithTransition.vue` is
whether that root is wrapped in `<Transition>`.

## What is expected?

Both boxes keep their internal styling (green background/border) *and* pick
up `external-class`, exactly like Vue DOM already does for the same source —
see `src/ChildWithTransition.vue` rendered through the vdom compiler instead
of Vapor: `class="external-class box internal-box"`.

## What actually happens?

- `ChildNoTransition` (A): `class="external-class box internal-box"` — correct.
- `ChildWithTransition` (B): `class="external-class"` — **`box` and
  `internal-box` are both gone**, not merged, not partially applied. Silently
  overwritten.

## Root cause

Traced against `@vue/runtime-vapor@3.6.0-rc.3`
(`runtime-vapor.esm-bundler.js`):

1. When a component's template root is `<Transition>`, that component is
   compiled as a **single-root child** of `VaporTransition`. `createComponent`
   auto-forwards the *calling* component's own received attrs onto that
   child (~line 2950):
   ```js
   if ((isSingleRoot || ...) && component.inheritAttrs !== false && isVaporComponent(currentInstance) && currentInstance.hasFallthrough) {
     const attrs = currentInstance.attrs
     ...
   }
   ```
   `component` here is `VaporTransition` — not the calling component. Since
   `VaporTransition` never sets `inheritAttrs: false`, this always fires for
   any component whose root is `<Transition>`, regardless of that
   component's *own* `inheritAttrs` setting.

2. `VaporTransition` receives these forwarded attrs as its own. In
   `handleSetupResult` (~line 3457):
   ```js
   if (instance.hasFallthrough && component.inheritAttrs !== false && Object.keys(instance.attrs).length) {
     const getFallthroughAttrs = ... () => instance.attrs
     applyFallthroughAttrs(instance.block, instance, getFallthroughAttrs)
   }
   ```
   `instance.block` resolves down to the wrapped component's real rendered
   element (`<Transition>` is a transparent pass-through).

3. `applyFallthroughAttrs` → `applyFallthroughProps(root, attrs)` →
   `setDynamicProps(el, [attrs])` (~line 3073) — a **single-source** array.
   `setDynamicProps` *can* merge multiple class sources correctly when given
   more than one (this is exactly how a dynamic component's
   `v-bind="[a, b]"` prop-array pattern already merges classes correctly
   elsewhere in the same codebase) — but here it's only ever given one
   source, the raw forwarded attrs, with no awareness of whatever `class`
   the wrapped component's own template independently computed. This call
   runs in its own `renderEffect`, separately from and after the wrapped
   component's own render, so it always wins outright.

## What was tried (all fail identically)

- Default (no `inheritAttrs`, implicit fallthrough)
- `inheritAttrs: false` + `useAttrs()` + `v-bind="attrs"` on the root,
  alongside an explicit `:class`
- `inheritAttrs: false` + explicit `:class="[internal, attrs.class]"` array
  binding, `class` excluded from any `v-bind` spread
- Isolating `attrs.class` into its own dedicated `computed()`

Removing `<Transition>` (same component, plain root, no wrapper) makes every
one of the above work correctly.

## Related, but distinct

[#15148](https://github.com/vuejs/core/issues/15148) (closed) covers a
different bug in the same general subsystem — a **functional** component's
own non-class/style attribute binding being *dropped* (not overwritten) when
the same key arrives as fallthrough. That issue's own repro table shows
plain **object** components (`defineVaporComponent`/`<script setup>`, no
`<Transition>` involved) working correctly, which matches what's fixed here:
the bug in this repo is specific to the `<Transition>`-as-root path, not
general object-component fallthrough handling.

## Other attrs are unaffected

`data-foo`-style attributes pass through correctly in both cases — only
`class` is overwritten, since `class` is the only attribute the wrapped
component *also* computes and binds itself.
