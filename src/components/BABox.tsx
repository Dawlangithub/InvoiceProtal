

type propsType = {
    children?: React.ReactNode,
    className?: string,
    sx?: any,
    onClick?: () => void,
}
export default function BABox(props: propsType) {
    const { children, className, sx, onClick } = props;


    return <>
        <div onClick={onClick} style={sx} className={className}>{children}</div>
    </>
}