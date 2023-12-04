import { IconButton } from "@suid/material"
import { Add, Search, Visibility } from "@suid/icons-material"
import { Link } from "@solidjs/router"


export const resultData = {
    data: new Array(30).fill({
        id: "1",
        phone_number: "+61987654321",
        id_number: "29393298377",
        gender: "MALE",
        alias_name: {
            count: 4,
            items: ['MICHAEL DANTON', 'MCDANTON', 'DANNY'] // limit 3
        },
        email: {
            count: 5,
            items: ['michael.danton@mail.com', 'michael@mail.com'] // limit 3
        },
        date_of_birth: {
            count: 10,
            items: ['11/AUG/1995', '1/AUG/1991', '10/AUG/1994'] // limit 3
        },
        religion: {
            count: 3,
            items: ['Christianity', 'Islam'] // limit 3
        },
        other_phone_number: {
            count: 8,
            items: ['+61917654321', '+61927654422'] // limit 3
        },
        devices: {
            count: 9,
            items: ['Vivo 5G', 'realme 5s']
        },

    }),
    columns: [
        {
            label: "ID",
            name: "id",
        },
        {
            label: "MSISDN",
            name: "MSISDN",
        },
        {
            label: "ID NUMBER",
            name: "id_number",
        },
        // {
        //     label: "ALIAS NAME",
        //     name: "alias_name",
        //     function: (d) => {

        //         return <div className="flex gap-2">
        //             <div>
        //                 {`[${d.alias_name.count}]`}
        //             </div>
        //             <div>
        //                 {
        //                     Array.isArray(d.alias_name.items) && d.alias_name.items.map(d => {
        //                         return <span>{d}, </span>
        //                     })
        //                 }
        //             </div>
        //         </div>
        //     }
        // },
        // {
        //     label: "GENDER",
        //     name: "gender",
        //     className: "!text-center",
        //     classColumns: "!text-center"
        // },
        // {
        //     label: "EMAIL",
        //     name: "email",

        //     function: (d) => {

        //         return <div className="flex gap-2">
        //             <div>
        //                 {`[${d.email.count}]`}
        //             </div>
        //             <div>
        //                 {
        //                     Array.isArray(d.email.items) && d.email.items.map(d => {
        //                         return <span>{d}, </span>
        //                     })
        //                 }
        //             </div>
        //         </div>
        //     }
        // },
        // {
        //     label: "DATE OF BIRTH",
        //     name: "date_of_birth",
        //     function: (d) => {

        //         return <div className="flex gap-2">
        //             <div>
        //                 {`[${d.date_of_birth.count}]`}
        //             </div>
        //             <div>
        //                 {
        //                     Array.isArray(d.date_of_birth.items) && d.date_of_birth.items.map(d => {
        //                         return <span>{d}, </span>
        //                     })
        //                 }
        //             </div>
        //         </div>
        //     }
        // },
        // {
        //     label: "RELIGION",
        //     name: "religion",
        //     function: (d) => {

        //         return <div className="flex gap-2">
        //             <div>
        //                 {`[${d.religion.count}]`}
        //             </div>
        //             <div>
        //                 {
        //                     Array.isArray(d.religion.items) && d.religion.items.map(d => {
        //                         return <span>{d}, </span>
        //                     })
        //                 }
        //             </div>
        //         </div>
        //     }
        // },
        // {
        //     label: "DEVICES",
        //     name: "devices",
        //     function: (d) => {

        //         return <div className="flex gap-2">
        //             <div>
        //                 {`[${d.devices.count}]`}
        //             </div>
        //             <div>
        //                 {
        //                     Array.isArray(d.devices.items) && d.devices.items.map(d => {
        //                         return <span>{d}, </span>
        //                     })
        //                 }
        //             </div>
        //         </div>
        //     }
        // },
        // {
        //     label: "OTHER PHONE NUMBER",
        //     name: "other_phone_number",
        //     function: (d) => {

        //         return <div className="flex gap-2">
        //             <div>
        //                 {`[${d.other_phone_number.count}]`}
        //             </div>
        //             <div>
        //                 {
        //                     Array.isArray(d.other_phone_number.items) && d.other_phone_number.items.map(d => {
        //                         return <span>{d}, </span>
        //                     })
        //                 }
        //             </div>
        //         </div>
        //     }
        // },
        {
            label: "DETAIL",
            name: "id",
            function: () => {
                return <Link href="/deck-explorer/search-result/database-information/+623902930">
                    <IconButton color="primary" >
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M25.3333 4H6.66667C5.95942 4 5.28115 4.28095 4.78105 4.78105C4.28095 5.28115 4 5.95942 4 6.66667V25.3333C4 26.0406 4.28095 26.7189 4.78105 27.219C5.28115 27.719 5.95942 28 6.66667 28H25.3333C26.8 28 28 26.8 28 25.3333V6.66667C28 5.95942 27.719 5.28115 27.219 4.78105C26.7189 4.28095 26.0406 4 25.3333 4ZM25.3333 25.3333H6.66667V9.33333H25.3333V25.3333ZM18 17.3333C18 18.44 17.1067 19.3333 16 19.3333C14.8933 19.3333 14 18.44 14 17.3333C14 16.2267 14.8933 15.3333 16 15.3333C17.1067 15.3333 18 16.2267 18 17.3333ZM16 12C12.36 12 9.25333 14.2133 8 17.3333C9.25333 20.4533 12.36 22.6667 16 22.6667C19.64 22.6667 22.7467 20.4533 24 17.3333C22.7467 14.2133 19.64 12 16 12ZM16 20.6667C15.1159 20.6667 14.2681 20.3155 13.643 19.6904C13.0179 19.0652 12.6667 18.2174 12.6667 17.3333C12.6667 16.4493 13.0179 15.6014 13.643 14.9763C14.2681 14.3512 15.1159 14 16 14C16.8841 14 17.7319 14.3512 18.357 14.9763C18.9821 15.6014 19.3333 16.4493 19.3333 17.3333C19.3333 18.2174 18.9821 19.0652 18.357 19.6904C17.7319 20.3155 16.8841 20.6667 16 20.6667Z" fill="currentColor" />
                        </svg>

                    </IconButton>
                </Link>
            }
        },


    ]
}

export const historyData = {
    columns: [
        {
            label: "Category",
            name: "category",
        },
        {
            label: "Keyword",
            name: "keyword",
        },
        {
            label: "Date",
            name: "timestamp",
        },
        {
            label: "",
            name: "function",
        },
    ],
    data: new Array(50).fill({
        category: "MSISDN",
        phone_number: "+6172837918299",
        date: "08/05/2023",
        time: "09:14 PM",
        function: (d) => {
            return <div className=" text-center">
                <IconButton  color="primary" size="small">
                   <Search fontSize="small"></Search>
                </IconButton>
            </div>
        }
    })
}

export const marketData = [
    {
        url: "https://static01.nyt.com/images/2019/10/02/video/02-still-for-america-room-loop/02-still-for-america-room-loop-superJumbo.jpg"
    },
    {
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqiEwxYC8eokQlBbUo-9ULbJQ5Rixa5q1MuA&usqp=CAU"
    },
    {
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIPLPdddeoV-KAmEm8lIwZl1m4Y7Avbp9-jA&usqp=CAU"
    },
    {
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqiEwxYC8eokQlBbUo-9ULbJQ5Rixa5q1MuA&usqp=CAU"
    },
    {
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIPLPdddeoV-KAmEm8lIwZl1m4Y7Avbp9-jA&usqp=CAU"
    },
    {
        url: "https://static01.nyt.com/images/2019/10/02/video/02-still-for-america-room-loop/02-still-for-america-room-loop-superJumbo.jpg"
    },
    {
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqiEwxYC8eokQlBbUo-9ULbJQ5Rixa5q1MuA&usqp=CAU"
    },
    {
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIPLPdddeoV-KAmEm8lIwZl1m4Y7Avbp9-jA&usqp=CAU"
    },
    {
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQg0bEV28o6WeIEzTZfXmbBNPRcxUnCDf9_IQ&usqp=CAU"
    },
    {
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIPLPdddeoV-KAmEm8lIwZl1m4Y7Avbp9-jA&usqp=CAU"
    },
]


export const TabsData = {
    dataHistory: [
        {
            title: "LATEST KEYWORD",
            key: "latest_keyword",
            active: true
        },
        {
            title: "SAVED KEYWORD",
            key: "saved_keyword",
            active: false
        },
    ],
    resultData: [
        {
            title: "CURRENT RESULT",
            key: "current_result",
            active: true
        },
        {
            title: "Monday",
            key: "monday",
            active: false
        },
        {
            title: "Wednesday",
            key: "wednesday",
            active: false
        },
        {
            title: "Thurdsday",
            key: "thurdsday",
            active: false
        },
        {
            title: "Friday",
            key: "friday",
            active: false
        },
        {
            title: "Saturday",
            key: "friday",
            active: false
        },
        {
            title: "Sunday",
            key: "friday",
            active: false
        },
    ]
}