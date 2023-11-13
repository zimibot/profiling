import Swal from "sweetalert2"

export const notify = ({ title = "Success", text = "Success", icon = "success", position = "top-end", ...props }) => {
    const Toast = Swal.mixin({
        toast: true,
        position,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        },
        ...props
    })

    Toast.fire({
        icon,
        text,
        title,
    })
}