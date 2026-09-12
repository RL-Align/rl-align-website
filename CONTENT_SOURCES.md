# Content sources and scope

Reviewed on 2026-09-06 using the connected GitHub repository and official public project pages. Website wording is a concise adaptation rather than a verbatim copy of the README.

| Content | Source |
| --- | --- |
| Community identity, mission, Slack invite, contact | https://github.com/RL-Align/.github/blob/main/profile/README.md |
| RL-Kernel description, operator scope, backends and original diagram | https://github.com/RL-Align/RL-Kernel/blob/main/README.md |
| CUDA / ROCm installation, PyTorch prerequisites | https://github.com/RL-Align/RL-Kernel/blob/main/docs/getting_started/installation.md |
| Hardware-specific quick-start commands: CUDA SM90 and ROCm gfx942 | User-supplied screenshot `Screenshot 2026-09-12 at 01.50.39.png`; installation flags follow that reference. GPU / extension verification is expanded into complete, copyable commands. |
| vime performance and memory results | https://github.com/RL-Align/RL-Kernel/blob/main/docs/blog/2026-07-08-announcing-rl-kernel-linear-logp-for-vime.md |
| Documentation entry point | https://rl-align.github.io/RL-Kernel/ |
| Orange community logo | https://avatars.githubusercontent.com/u/290232446?v=4 |
| Original architecture image | https://github.com/RL-Align/RL-Kernel/blob/main/docs/assets/RL-Kernel%20underlying%20operator%20library%20technical%20architecture.png |

## Historical benchmark scope

- Qwen3-30B-A3B, 8 × H100 80GB, full vLLM rollout and Megatron training.
- TP=2, PP=1, CP=1, EP=8; 12-rollout no-trace runs; stable rollout window 3–11.
- T3 `linear_logp` forward + backward CUDA time: 33.96 ms → 18.50 ms, reported 1.84× speedup.
- T3 single-operator peak reserved memory delta: 32,342 MB → 26,710 MB, saving 5,632 MB.
- T1/T2/T3 each report zero fallback for the enabled fused path.
- T3 full-step time: 232.20 s → 228.40 s, reported 1.6% improvement.
- These results validate the performance path, not zero end-to-end train–rollout mismatch or universal cross-hardware bitwise equivalence. The homepage makes this distinction explicitly.
- The original ecosystem row named relevant open-source frameworks. On September 11 it was replaced with the three partners explicitly specified by the user; this is not evidence for additional customer or performance claims.
- The original architecture includes a broader hardware vision. Current backend availability is operator-specific; the homepage presents CUDA and ROCm and links to installation requirements.

## Date

September 10, 2026 is the Thursday following September 6, 2026. It was inferred from the user's announced launch plan, not verified against a published GitHub release. The original banner was explicitly prospective; it was removed during the September 11 visual redesign.

## GitHub file revisions reviewed

- Project README blob: `e2788c6a9adc775ca15b6094a2392362925887ab`
- Community README blob: `335db6b695786d28cf22018332e880414f86400d`
- vime article blob: `068b22452a4f50a7de5108e728e7006f9a4ed773`
- Installation guide blob: `0e8bad461473c91966230e7179102cd01c3bf22f`
- Original architecture blob: `7feb696636c34b31ea70e204d3832bea229b88e4`

These are file blob identifiers, not branch commit identifiers.

## Architecture expansion, 2026-09-06

The user supplied a newer architecture screenshot showing vime orchestration, vLLM rollout, Megatron-LM training, and CUDA / ROCm / partial Ascend target branches. The updated homepage follows that hierarchy and preserves the earlier full ecosystem diagram separately.

- Hardware family labels and the Ascend `dav_c220` target follow the user-supplied project diagram. They are presented as target families, not claims of per-model or end-to-end validation.
- The vime integration article cited above supports the orchestration / execution distinction.
- Runtime dispatch and per-operator selection: https://github.com/RL-Align/RL-Kernel/blob/main/docs/design/runtime-dispatch.md (blob `c8bf3d140b3ce599161f58ed19a6393b0a5c4573`).
- Partial Ascend implementation is visible in https://github.com/RL-Align/RL-Kernel/blob/main/rl_engine/_C_npu.pyi (blob `bff5e2e7eb7f1d60dca6c50666bb306d741cf7ee`), which declares `batch_invariant_logp_ascend`. This does not imply full Ascend coverage.
- Operator families are grounded in the README, operator documentation, and https://github.com/RL-Align/RL-Kernel/tree/main/rl_engine/kernels/ops, including the canonical linear and RMSNorm implementations.

## Visual redesign, 2026-09-11

- User references: https://miles.radixark.com/ and https://www.radixark.com/, reviewed on September 11 for content hierarchy and editorial restraint. No third-party copy, logos, testimonials, or product claims are reused.
- User-supplied community postcard: `WhatsApp Image 2026-09-10 at 15.40.10.jpeg`. Its exploration and alignment message is adapted for the principles section. The initial redesign used black, silver, cool violet, and ice blue; the user's subsequent September 11 instruction restores orange accents.
- `assets/alignment-chrome.webp`: one original image generated for this Site on September 11, showing fluid silver loops with cool reflections against a black background. No third-party source artwork is embedded.
- The expanded SVG architecture diagrams are recolored without changing their topology or support labels. The complete original `architecture.png` retains Git blob `7feb696636c34b31ea70e204d3832bea229b88e4` and is available through a native disclosure.
- The performance values and technical references above are retained from the September 6 review, with their original scope; this redesign does not claim a new benchmark run or release status.

## Typography and official partner logos, 2026-09-11

The user requested orange accents, Miles-style typography, and the vime / AMD / Moore Threads logos in a Partners strip. Partnership placement is based on that instruction, not an inference from software compatibility.

- Miles typography was inspected on https://miles.radixark.com/. Its visible hero text uses `stix` at weight 500, letter spacing `-0.02em`, and line height `1.2`; its font-face source is named `stix_two_text_latin_var`. The earlier Site revision used STIX Two Text for display headings. This is superseded by the user's subsequent RadixArk typography reference below. No Miles headline copy or proprietary font file was reused.
- Official font specimen: https://fonts.google.com/specimen/STIX+Two+Text
- The earlier Latin variable WOFF2 was downloaded unchanged from https://fonts.gstatic.com/s/stixtwotext/v18/YA9Vr02F12Xkf5whdwKf11l0p76Miw.woff2 via the Google Fonts CSS API, with its license from https://github.com/google/fonts/blob/main/ofl/stixtwotext/OFL.txt. That unused font and license are removed from the current output; the earlier saved revisions retain them.

| Asset | Official source and identity |
| --- | --- |
| `assets/partners/vime.jpg` | https://github.com/vllm-project/vime/blob/main/docs/_static/image/logo.jpg — configured as `html_logo` in https://github.com/vllm-project/vime/blob/main/docs/conf.py; the reinforcement-learning framework, not the unrelated vime-js media player |
| `assets/partners/amd.svg` | https://www.amd.com/content/dam/code/images/header/amd-header-logo.svg — white wordmark from the official AMD website header |
| `assets/partners/moore-threads.png` | https://mt-website-prod.mthreads.com/image/logo/logo.png — bilingual footer logo linked by https://www.mthreads.com/ |

All three logo files are preserved as downloaded. Vime's surrounding whitespace is clipped in CSS, with a monochrome filter for legibility on black. AMD and Moore Threads use their official dark-background variants. The supplied partner list does not expand the hardware support claims in the architecture section.

## Performance section removal, 2026-09-11

The user requested removal of the entire Performance / With the evidence section. The three metrics, benchmark configuration, methodology note, report links, and Benchmarks navigation entry are no longer displayed on the homepage. The earlier evidence remains above solely as a record of previously published content. No replacement performance claims are introduced.

## Site-wide RadixArk typography, 2026-09-11

- Latest user reference: `5a185130-1cd3-4900-b657-f83418bc3129.jpeg`, showing Our Mission and What we build on https://www.radixark.com/.
- Live computed styles on the reference page identify Hanken Grotesk. The Our Mission title uses weight 400 and `-0.02em` spacing; What we build uses weight 500 and `-0.03em` spacing. Reference body text uses weight 300, 17 px type, and 27.2 px line height at the inspected viewport. The Site adapts this hierarchy to its own existing layout without copying RadixArk prose.
- Official font specimen: https://fonts.google.com/specimen/Hanken+Grotesk
- Font download: https://fonts.gstatic.com/s/hankengrotesk/v12/ieVn2YZDLWuGJpnzaiwFXS9tYtpd59A.woff2, supplied through the Google Fonts CSS API for weights 300–700. The file is stored unchanged at `assets/fonts/hanken-grotesk-latin-variable.woff2`.
- Font license: https://github.com/google/fonts/blob/main/ofl/hankengrotesk/OFL.txt, included at `assets/fonts/OFL-Hanken-Grotesk.txt`. The overview SVGs embed the same WOFF2 data; this license covers those embedded copies too.
- All editable website typography now uses this one family. Official logo assets and the preserved original architecture raster remain unchanged. The previously removed benchmark section remains absent.


## Community social bubbles · September 12, 2026

- Five destinations are taken from the user's request and maintained in `site.conf`. The LinkedIn URL is retained verbatim, including its admin route; the public-page equivalent could not be verified. X and Slack could not be independently opened by the browsing service. These limitations do not affect local link generation.
- The WeChat Markdown page was read through the GitHub connector at the specified `docs/readme-platform-support` branch. It contains the community QR code and fallback member contacts. The WhatsApp image remains a link to the exact GitHub image page supplied by the user.
- Brand SVGs are vendored from Font Awesome Free 7.3.1, CC BY 4.0, with original attribution comments and `assets/social/NOTICE.txt`.
- weixin.svg: https://github.com/FortAwesome/Font-Awesome/blob/7.x/svgs/brands/weixin.svg (blob baf93ce5eccf10710922a6658713a0e6950045cc).
- x-twitter.svg: https://github.com/FortAwesome/Font-Awesome/blob/7.x/svgs/brands/x-twitter.svg (blob e3b36e7e375274095a33d0cb0f9eba9edecb163f).
- linkedin-in.svg: https://github.com/FortAwesome/Font-Awesome/blob/7.x/svgs/brands/linkedin-in.svg (blob 7b706c06da3f963a0a8f4e0a998df15b6b4bc03d).
- whatsapp.svg: https://github.com/FortAwesome/Font-Awesome/blob/7.x/svgs/brands/whatsapp.svg (blob f74f960397a16bdee0eb45947bb0efd3bc206693).
- slack.svg: https://github.com/FortAwesome/Font-Awesome/blob/7.x/svgs/brands/slack.svg (blob 546b270c316d3d898a0361553b6c335bb50f4bbe).
