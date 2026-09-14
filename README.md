# Selective Speech Enhancement: Removing Requested Degradations While Preserving Acoustic Context

Static listening page for **Selective Speech Enhancement: Removing Requested Degradations
While Preserving Acoustic Context**.
The page demonstrates selective control over ambient noise, foreground interference,
coloration, early reflections, and late reverberation. Every degraded input identifies
its present degradations, and every selective-model output is paired with the exact partial
or clean target for its request.

## Local preview

Browsers do not allow `fetch()` from a local `file://` page. Serve the directory locally:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## GitHub Pages deployment

1. Push this repository to GitHub.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Select the `main` branch and `/ (root)` directory.

The resulting site is available at
`https://<github-user>.github.io/selective-speech-enhancement-demo/`.

## Listening-example details

- Speech: held-out VCTK utterances `p278_080.wav` and `p330_100.wav` (5.72 s)
- Ambient noise: WHAM! test recordings at 12 dB SNR
- Foreground interference: FSD50K dog-barking clip `428860` and emergency-siren
  clip `117120`, at 2 dB SNR
- Foreground activity: 2.50 s
- Nominal simulated room reverberation time: 0.57 s
- Coloration: 18 dB/octave low-pass filter with a 3.00 kHz cutoff
- Sampling rate: 48 kHz
- Waveform normalization: none
- Inference: 3.0 s chunks, 0.5 s overlap, Hann-weighted overlap-add

Each example includes full enhancement to a clean target. Among partial requests, those
that remove early reflections while retaining only late reverberation are excluded under
the study protocol.

## Attribution

The VCTK Corpus is distributed under the Open Data Commons Attribution License v1.0.
WHAM! is described by Wichern et al., *WHAM!: Extending Speech Separation to Noisy
Environments*, Interspeech 2019. FSD50K is described by Fonseca et al., *FSD50K: An Open
Dataset of Human-Labeled Sound Events*, IEEE/ACM TASLP 2022. Individual FSD50K clips
retain their respective Creative Commons licences. The dog event is
[`big_dog_barking.wav`](https://freesound.org/people/buzzmsc/sounds/428860/) by
Freesound user buzzmsc, licensed under
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). The siren event is
[`siren_med.wav`](https://freesound.org/people/UncleSigmund/sounds/117120/) by
Freesound user UncleSigmund, released under
[CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/).
