const supabase = window.supabase.createClient("YOUR_URL","YOUR_KEY");

async function login(){
    let { error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value
    });

    if(error) return alert("Login Failed");
    window.location="index.html";
}

async function signup(){
    await supabase.auth.signUp({
        email: email.value,
        password: password.value
    });
    alert("Account Created");
}