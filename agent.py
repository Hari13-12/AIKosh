from dotenv import load_dotenv

from livekit import agents, rtc
from livekit.agents import AgentServer,AgentSession, Agent, room_io
from livekit.plugins import noise_cancellation, silero
from livekit.plugins.turn_detector.multilingual import MultilingualModel
from livekit.agents import function_tool, RunContext

import json

load_dotenv(r"D:\AI Kosh\Assistant\.env")


class Assistant(Agent):
    def __init__(self, data: dict) -> None:
        super().__init__(
            instructions="""

            You are a professional, and multilingual voice assistant designed to help MSME users complete digital onboarding and registration in ONDC.
            Your goal is to guide the user step by step, ask only one question at a time, and ensure clarity before moving to the next step.
            Speak in simple, non-technical language. Be patient, supportive, and neutral.
            If the user sounds confused or gives an incomplete answer, politely rephrase the question.
            If the user says they do not know an answer, acknowledge it and move on where possible.
            Do not assume information. Always confirm critical details.
 
            CONVERSATION FLOW INSTRUCTIONS:
            1.) Greeting & Consent:
            - Greet the user warmly.
            - Explain briefly that you will help with MSME onboarding.
            - Ask for consent to proceed.
            Output:
            Hello! Im here to help you with MSME registration and onboarding.
            
            2.) MSME Status Check:
            - Ask whether the user is MSME registered or not? 
            - For this always the use msme_tool() to save the user's response

            3.) BUSINESS BASIC DETAILS:
            - Ask the basic business details from the user
            - Ask one by one:
                - Business name
                - What kind of work are you doing (selling flower, manufacturing plastic items, etc...)
                - Business location (area, district and state)
            - For this use the business() tool to work based on user response.
            
            4.) PRODUCT RELATED DETAILS:
            - Ask questions about the user’s products or services in a clear and simple manner.
            - Ask one question at a time and wait for the user’s response before continuing.
            - Do not assume answers. If the user is unsure, acknowledge and move to the next question. 
                Questions to Ask (in order):
                - Product Description
                  -> Could you please tell me what products or items your business makes or sell?
                - Shipping Time
                  -> After an order is placed, how many days do you usually take to ship the product?
                  If unclear:
                  -You can give an approximate number of days.
                - Return Policy
                  -> If a customer is not satisfied with the product, do you allow returns?
                  If yes:
                  - Thank you. I've noted that returns are allowed.
                  If no:
                  - Okay, I've noted that returns are not available.
                - Order Cancellation
                  -> Is it possible for a customer to cancel the order after placing it?
                  If yes:
                  - Thank you. I've recorded that order cancellation is allowed.
                  If no:
                  - Alright. I've noted that order cancellation is not permitted.
            - For this always use prod_info() tool to work based on users response

            IMPORTANT:
            WHEN THE ABOVE PROCESS ARE COMPLETED, ALWAYS CALL THE save_response() tool to save all the user's response.
            """
            )
        self.data = data

    @function_tool
    async def msme_tool(self, ctx: RunContext, user_response: str):
        """You are tool used to get the user response for MSME registered or NOT"""
        self.data["msme"] = user_response
        return f"Thank you for the response, i confirm that you are MSME {user_response}"
    
    @function_tool
    async def business_tool(self, ctx: RunContext, busi_name: str, busi_type: list[str], busi_loc: list[str]):
        """Ypu are a tool helps to get the business related information to the user"""
        self.data["business_name"] = busi_name

        self.data["type"] = busi_type
        self.data["location"] = busi_loc
        return f"I got some information of your business like {busi_name}, {busi_type} and {busi_loc}"

    @function_tool
    async def product_info(
        self,
        ctx: RunContext,
        product_description: str,
        shipping_time_days: int | None,
        return_allowed: bool | None,
        cancellation_allowed: bool | None
    ):
        """
        You are a tool captures product-related details provided by the user.

        Parameters:
        - product_description: Description of products or services offered by the business.
        - shipping_time_days: Approximate number of days required to ship the product.
        - return_allowed: Whether product returns are allowed.
        - cancellation_allowed: Whether order cancellation is permitted.
        """
        self.data["des"] = product_description
        self.data["ship_days"] = shipping_time_days
        if return_allowed:
            self.data["return_allowed"] = "yes"
        else:
            self.data["return_allowed"] = "no"
        if cancellation_allowed:
            self.data["cancellation_allowed"] = "yes"
        else:
            self.data["cancellation_allowed"] = "no"
        
        return "Product related responses are saved successfully"


    @function_tool
    async def save_response(self, ctx: RunContext):
        """You are a tool helps to save the users response"""
        
        try:
            with open("data.json", "w", encoding="utf-8") as f:
                json.dump(self.data, f, indent=4)
            return "Your response have been recorded successfully"
        except Exception as e:
            return f"Error while saving {str(e)}"

server = AgentServer()

@server.rtc_session()
async def my_agent(ctx: agents.JobContext):
    data = {}
    session = AgentSession(
        stt="deepgram/nova-3:multi",
        llm="openai/gpt-4.1-mini",
        tts="cartesia/sonic-3:9626c31c-bec5-4cca-baa8-f8ba9e84c8bc",
        vad=silero.VAD.load(),
        turn_detection=MultilingualModel(),
    )

    await session.start(
        room=ctx.room,
        agent=Assistant(data = data),
        room_options=room_io.RoomOptions(
            audio_input=room_io.AudioInputOptions(
                noise_cancellation=lambda params: noise_cancellation.BVCTelephony() if params.participant.kind == rtc.ParticipantKind.PARTICIPANT_KIND_SIP else noise_cancellation.BVC(),
            ),
        ),
    )

    await session.generate_reply(
        instructions="Greet the user and offer your assistance."
    )


if __name__ == "__main__":
    agents.cli.run_app(server)