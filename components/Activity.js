export default function activity({ text, time }) {
  return (
    <li>
      <p>{text}</p>
      <span className="text-gray-500 text-xs">{time}</span>
    </li>
  )
}
