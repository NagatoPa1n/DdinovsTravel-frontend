import { useRef, useState } from 'react'

export default function VideoPreview({ src, poster }) {
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)

  const toggle = (event) => {
    event.stopPropagation()
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      video.play()
      setPlaying(true)
    } else {
      video.pause()
      setPlaying(false)
    }
  }

  return (
    <div className="video-preview">
      <video ref={videoRef} src={src} poster={poster} muted playsInline onEnded={() => setPlaying(false)} />
      <button type="button" className="video-preview__play" onClick={toggle} aria-label={playing ? 'Pause' : 'Play'}>
        {playing ? '❚❚' : '▶'}
      </button>
    </div>
  )
}
