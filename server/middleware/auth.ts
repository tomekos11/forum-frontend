
export default defineEventHandler(async (event) => {
});

//   if (event.context.hasCheckedUser) {
//     return;
//   }
    
//   // Ustaw flagę, aby uniknąć ponownego wykonania
//   event.context.hasCheckedUser = true;

//   try {
//     const config = useRuntimeConfig();
//     const userData = await $fetch(`${config.public.API_URL}/check-user`, {
//       headers: {
//         ...event.node.req.headers
//       }
//     });

//     console.log(userData);

//     event.context.user = userData.user;
//   } catch (error) {
//     console.error('Błąd pobierania danych użytkownika:', error);
//   }
// });
