import HeaderComponents from "@/components/RegisterComponents/HeaderComponent";
import ConnexionInput from "@/components/RegisterComponents/Connexion/ConnexionInput";
import RememberLine from "@/components/RegisterComponents/Infos/RememberLine";
import Sign from "@/components/RegisterComponents/Sign";
import BreakLine from "@/components/RegisterComponents/BreakLine";
import LinkConnexion from "@/components/RegisterComponents/LinkConnexion";
import ButtonLine from "@/components/RegisterComponents/OtherConnexionButton.tsx/ButtonLine";

export default function Home() {
	return (
		<div className="bg-white w-screen h-dvh   ">
			<div className="w-full h-full  px-6 py-12   flex flex-col  justify-between">
				<div className=" flex flex-col gap-8">
					<HeaderComponents />
					<div className="flex flex-col gap-6">
						<ConnexionInput role="text" name="Enter Email" />
						<ConnexionInput
							role="password"
							name="Enter password"
							icon={"eye-off"}
						/>
						<ConnexionInput
							role="password"
							name="Enter password"
							icon={"eye-off"}
						/>
					</div>

					<div className="flex flex-col gap-7">
						<Sign />
						<BreakLine />
						<ButtonLine />
					</div>
				</div>
				<div>
					<LinkConnexion />
				</div>
			</div>
		</div>
	);
}
