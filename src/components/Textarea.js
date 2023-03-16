import styles from '@/styles/components/Textarea.module.css'

const Textarea = ({ disabled = false, className, ...props }) => (
    <textarea
    disabled={disabled}
    className={styles.textarea}
        {...props}
    />
)

export default Textarea
