import "./spinner.css"

const Spinner = ({ show }) => {
    return (
        <div className="col-3" style={{ display: show ? "block" : "none" }}>
            <div className="snippet" data-title="dot-flashing">
                <div className="stage">
                    <div className="dot-flashing"></div>
                </div>
            </div>
        </div>
    )
}

export default Spinner;