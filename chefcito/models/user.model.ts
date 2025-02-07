export type UserPost = {
    localid:string,
    email:string,
}

export type Profile = {
    data:{
        localid:string,
        email: string,
        name:string,
        phone_number:string,
    },
    points: {
        user: string,
        total: 0,
        level: string
    }
  }
