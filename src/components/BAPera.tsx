

type propsType = {
    children?: React.ReactNode,
    className?: string,
    sx?: any,
    onClick?: () => void,
}
export default function BAPera(props: propsType) {
    const { children, className, sx, onClick } = props;
    return <>
        <p onClick={onClick} style={sx} className={className}>{children}</p>
    </>
}