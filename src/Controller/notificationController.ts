import GetNotifications from "../use-cases/notification/GetNotifications.js";

class notificationController {
    async getNotifications(req: any, res: any) {
        try {
            const userId = req.user.userId;

            const notifications = await GetNotifications(userId);

            return res.status(200).json({ notifications });

        } catch (error) {
            console.error("Erro ao buscar notificações:", error);

            return res.status(500).json({
                error: "Erro interno ao buscar notificações.",
            });
        }
    }
}

export default notificationController;
